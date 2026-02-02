import axios from 'axios';
import 'dotenv/config';

const LARK_APP_ID = process.env.LARK_APP_ID;
const LARK_APP_SECRET = process.env.LARK_APP_SECRET;

export async function getTenantAccessToken() {
  if (!LARK_APP_ID || !LARK_APP_SECRET) {
    throw new Error('LARK_APP_ID or LARK_APP_SECRET is missing in environment variables');
  }
   

  try {
    const response = await axios.post(
      'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
      {
        app_id: LARK_APP_ID,
        app_secret: LARK_APP_SECRET,
      }
    );

    if (response.data.code !== 0) {
        console.error('Failed to get tenant access token:', response.data);
        throw new Error(`Feishu Auth Error: ${response.data.msg}`);
    }

    return response.data.tenant_access_token;
  } catch (error) {
    console.error('Error getting tenant access token:', error);
    throw error;
  }
}

export async function searchUserInTable(accessToken, appToken, tableId, username, password) {
  // Search for the user in the config table
  // Assuming columns: Username, Password, User_ID, Target_Base_ID, Target_Table_ID, Nickname
  
  const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/search`;
  
  try {
    const response = await axios.post(
      url,
      {
        filter: {
          conjunction: "and",
          conditions: [
            {
              field_name: "username",
              operator: "is",
              value: [username]
            },
            {
              field_name: "password",
              operator: "is",
              value: [password]
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.code !== 0) {
      console.error('Search user failed:', response.data);
      throw new Error(`Feishu Search Error: ${response.data.msg}`);
    }

    if (response.data.data && response.data.data.items && response.data.data.items.length > 0) {
      
        const record = response.data.data.items[0].fields;
        console.log(record)

        if (!record.enabled) {
            throw new Error('账号未启用');
        }

        let config = {};
        try {
            if (record.configuration) {
                config = JSON.parse(record.configuration.map(item => item.text).join(''));
            }
        } catch (e) {
            console.error("Failed to parse configuration", e);
        }

        return {
            userId: record.user_id,
            username: record.username,
            nickname: record.Nickname,
            configuration: config
        };
    }
    return null;

  } catch (error) {
    console.error('Error searching user:', error.response?.data || error);
    throw error;
  }
}

export async function getRecords(accessToken, appToken, tableId, userId, range = 'today') {
  // Use Search records API (POST) which supports "Today" filter for Date fields
  // This avoids timezone issues and simplifies the logic.
  
  // 1. First, fetch ONE record without filter to detect actual field names
  // This is crucial because field names in Bitable can be "user_id", "User_ID", "record_time", "Record_Time" etc.
  let userField = "user_id";
  let timeField = "record_time";
  
  try {
      const detectUrl = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`;
      const detectResponse = await axios.get(detectUrl, {
          params: { page_size: 1 }, 
          headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (detectResponse.data.data && detectResponse.data.data.items && detectResponse.data.data.items.length > 0) {
          const fields = detectResponse.data.data.items[0].fields;
          const keys = Object.keys(fields);
          
          // Detect User ID field
          const foundUserField = keys.find(k => k.toLowerCase() === 'user_id' || k.toLowerCase() === 'userid');
          if (foundUserField) userField = foundUserField;
          
          // Detect Time field
          const foundTimeField = keys.find(k => k.toLowerCase() === 'record_time' || k.toLowerCase() === 'recordtime' || k.toLowerCase() === 'date' || k.toLowerCase() === 'time');
          if (foundTimeField) timeField = foundTimeField;
          
          console.log(`[Schema Detect] Detected fields - User: ${userField}, Time: ${timeField}`);
      }
  } catch (e) {
      console.warn("[Schema Detect] Failed to detect fields, using defaults.", e.message);
  }

  // 2. Construct Filter Object for Search API
  const conditions = [
      {
          field_name: userField,
          operator: "is",
          value: [userId]
      }
  ];

  // Only add time filter if range is 'today'
  if (range === 'today') {
      conditions.push({
          field_name: timeField,
          operator: "is",
          value: ["Today"]
      });
  }

  const requestBody = {
      filter: {
          conjunction: "and",
          conditions: conditions
      },
      sort: [
          {
              field_name: timeField,
              desc: true
          }
      ]
  };

  const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/search`;

  try {
    const response = await axios.post(
      url,
      requestBody,
      {
        params: {
            page_size: range === 'all' ? 500 : 100 // Limit to 500 for all history, 100 for today
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.code !== 0) {
      console.error('Get records failed:', response.data);
      throw new Error(`Feishu Get Records Error: ${response.data.msg}`);
    }

    if (response.data.data && response.data.data.items) {
        let items = response.data.data.items;
        
        return items.map(item => ({
            id: item.record_id,
            fields: item.fields,
            createdTime: item.fields[timeField] || item.fields.record_time || item.created_time || Date.now() 
        }));
    }
    return [];

  } catch (error) {
    console.error('Error getting records:', error.response?.data || error);
    throw error;
  }
}

export async function addRecord(accessToken, appToken, tableId, recordData) {
    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`;
    
    try {
        const response = await axios.post(
            url,
            {
                fields: recordData
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error adding record:', error.response?.data || error);
        throw error;
    }
}

export async function deleteRecord(accessToken, appToken, tableId, recordId) {
    const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records/${recordId}`;
    
    try {
        const response = await axios.delete(
            url,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );
        
        if (response.data.code !== 0) {
             console.error('Delete record failed:', response.data);
             throw new Error(`Feishu Delete Error: ${response.data.msg}`);
        }
        
        return response.data;
    } catch (error) {
        console.error('Error deleting record:', error.response?.data || error);
        throw error;
    }
}
