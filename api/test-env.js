
export default function handler(req, res) {
  const envVars = {
    LARK_APP_ID: process.env.LARK_APP_ID ? 'Set (Length: ' + process.env.LARK_APP_ID.length + ')' : 'Not Set',
    LARK_APP_SECRET: process.env.LARK_APP_SECRET ? 'Set (Length: ' + process.env.LARK_APP_SECRET.length + ')' : 'Not Set',
    NODE_ENV: process.env.NODE_ENV,
    ALL_KEYS: Object.keys(process.env).filter(key => !key.includes('SECRET') && !key.includes('KEY') && !key.includes('TOKEN')) // 安全起见只列出非敏感 key
  };

  res.status(200).json({
    message: 'Environment Variable Debug Info',
    env: envVars
  });
}
