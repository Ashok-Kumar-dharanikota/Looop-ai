import os
from PIL import Image

THEME1_PATH = r"C:\Users\ASUS\.gemini\antigravity-ide\brain\e1d3fbbb-0194-42b2-8bea-facb1562a572\looop_logo_v1_orange_on_white_1787385065007.jpg"
THEME2_PATH = r"C:\Users\ASUS\.gemini\antigravity-ide\brain\e1d3fbbb-0194-42b2-8bea-facb1562a572\looop_logo_v2_clean_orange_bg_1787385208764.jpg"
WORKSPACE_DIR = r"c:\Users\ASUS\OneDrive\Documents\Ashok Kumar\startups\Looop"

def generate_icons():
    # -------------------------------------------------------------
    # 1. GENERATE ACTIVE ASSETS (THEME 1: Orange on Soft White)
    # -------------------------------------------------------------
    theme1_img = Image.open(THEME1_PATH).convert("RGBA")
    
    # 1024x1024 standard app icons
    icon_1024_t1 = theme1_img.resize((1024, 1024), Image.Resampling.LANCZOS)
    
    main_icon_path = os.path.join(WORKSPACE_DIR, "assets", "appicons", "logo.png")
    images_icon_path = os.path.join(WORKSPACE_DIR, "assets", "images", "icon.png")
    android_fg_path = os.path.join(WORKSPACE_DIR, "assets", "images", "android-icon-foreground.png")
    
    icon_1024_t1.save(main_icon_path, format="PNG", optimize=True)
    icon_1024_t1.save(images_icon_path, format="PNG", optimize=True)
    icon_1024_t1.save(android_fg_path, format="PNG", optimize=True)
    print(f"Generated Active App Icon (Theme 1): {main_icon_path} (1024x1024)")
    print(f"Generated Active App Icon (Theme 1): {images_icon_path} (1024x1024)")
    print(f"Generated Active Android FG (Theme 1): {android_fg_path} (1024x1024)")
    
    # Android Adaptive BG for Theme 1 (#FAF9F6)
    android_bg_t1 = Image.new("RGBA", (1024, 1024), (250, 249, 246, 255))
    android_bg_path = os.path.join(WORKSPACE_DIR, "assets", "images", "android-icon-background.png")
    android_bg_t1.save(android_bg_path, format="PNG", optimize=True)
    print(f"Generated Active Android BG: {android_bg_path} (1024x1024)")
    
    # Splash Screen Icon (512x512)
    splash_icon_t1 = theme1_img.resize((512, 512), Image.Resampling.LANCZOS)
    splash_path = os.path.join(WORKSPACE_DIR, "assets", "images", "splash-icon.png")
    splash_icon_t1.save(splash_path, format="PNG", optimize=True)
    print(f"Generated Active Splash Icon: {splash_path} (512x512)")
    
    # Favicon (64x64)
    favicon_64_t1 = theme1_img.resize((64, 64), Image.Resampling.LANCZOS)
    favicon_path = os.path.join(WORKSPACE_DIR, "assets", "images", "favicon.png")
    favicon_64_t1.save(favicon_path, format="PNG", optimize=True)
    print(f"Generated Active Favicon: {favicon_path} (64x64)")
    
    # -------------------------------------------------------------
    # 2. SAVE BACKUP ASSETS (THEME 2: White on Gradient Orange)
    # -------------------------------------------------------------
    theme2_img = Image.open(THEME2_PATH).convert("RGBA")
    
    backup_appicons_dir = os.path.join(WORKSPACE_DIR, "assets", "appicons", "theme2-backup-white-on-orange")
    backup_images_dir = os.path.join(WORKSPACE_DIR, "assets", "images", "theme2-backup-white-on-orange")
    os.makedirs(backup_appicons_dir, exist_ok=True)
    os.makedirs(backup_images_dir, exist_ok=True)
    
    icon_1024_t2 = theme2_img.resize((1024, 1024), Image.Resampling.LANCZOS)
    splash_512_t2 = theme2_img.resize((512, 512), Image.Resampling.LANCZOS)
    favicon_64_t2 = theme2_img.resize((64, 64), Image.Resampling.LANCZOS)
    
    icon_1024_t2.save(os.path.join(backup_appicons_dir, "logo.png"), format="PNG", optimize=True)
    icon_1024_t2.save(os.path.join(backup_images_dir, "icon.png"), format="PNG", optimize=True)
    icon_1024_t2.save(os.path.join(backup_images_dir, "android-icon-foreground.png"), format="PNG", optimize=True)
    splash_512_t2.save(os.path.join(backup_images_dir, "splash-icon.png"), format="PNG", optimize=True)
    favicon_64_t2.save(os.path.join(backup_images_dir, "favicon.png"), format="PNG", optimize=True)
    
    print(f"Saved Theme 2 Backup to: {backup_appicons_dir}")
    print(f"Saved Theme 2 Backup to: {backup_images_dir}")

if __name__ == "__main__":
    generate_icons()
