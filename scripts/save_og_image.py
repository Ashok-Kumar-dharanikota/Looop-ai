import os
from PIL import Image

OG_BANNER_SOURCE = r"C:\Users\ASUS\.gemini\antigravity-ide\brain\e1d3fbbb-0194-42b2-8bea-facb1562a572\looop_opengraph_banner_1787390889832.jpg"
WORKSPACE_DIR = r"c:\Users\ASUS\OneDrive\Documents\Ashok Kumar\startups\Looop"

def save_og_image():
    img = Image.open(OG_BANNER_SOURCE).convert("RGB")
    img_resized = img.resize((1200, 630), Image.Resampling.LANCZOS)
    
    target_path = os.path.join(WORKSPACE_DIR, "assets", "images", "og-image.png")
    img_resized.save(target_path, format="PNG", optimize=True)
    print(f"Saved OG Image: {target_path} (1200x630)")

if __name__ == "__main__":
    save_og_image()
