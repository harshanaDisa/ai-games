import requests
import os
import time
import random

def save_glb_files(car_url, obstacle_url):
    """Downloads and saves .glb files from given URLs with retries and delays."""

    def download_and_save(url, filename):
        headers = {
            'User-Agent': 'GLB Downloader Script (your_email@example.com)'  # Replace with your info
        }
        max_retries = 5
        for attempt in range(max_retries):
            try:
                response = requests.get(url, stream=True, headers=headers)
                response.raise_for_status()
                with open(filename, "wb") as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                print(f"File saved as {filename}")
                return  # Success, exit the retry loop

            except requests.exceptions.RequestException as e:
                if attempt < max_retries - 1:  # Don't wait after the last attempt
                    wait_time = 2 ** attempt + random.uniform(0, 1)  # Exponential backoff + jitter
                    print(f"Attempt {attempt + 1} failed: {e}. Retrying in {wait_time:.2f} seconds...")
                    time.sleep(wait_time)
                else:
                    print(f"Error downloading or saving {filename}: {e}")
                    return  # failed

    download_and_save(car_url, "ID0jC9X.glb")
    time.sleep(1) # simple delay
    download_and_save(obstacle_url, "9p6zDwa.glb")



# Replace with the actual URLs of your .glb files
car_model_url = "https://i.imgur.com/ID0jC9X.glb"
obstacle_model_url = "https://i.imgur.com/9p6zDwa.glb"

save_glb_files(car_model_url, obstacle_model_url)
