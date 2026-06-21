import re
import json

file_path = r"C:\Users\Khoa\.gemini\antigravity-ide\brain\8f4dad49-2e94-4f1e-b4be-dce77cc3c9c2\.system_generated\steps\1128\content.md"

try:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Tìm JSON của ytInitialData
    match = re.search(r"ytInitialData\s*=\s*(\{.*?\});", content)
    if not match:
        match = re.search(r"var ytInitialData\s*=\s*(\{.*?\});", content)

    videos = []

    if match:
        json_str = match.group(1)
        data = json.loads(json_str)

        def find_videos(obj):
            if isinstance(obj, dict):
                if "playlistVideoRenderer" in obj:
                    renderer = obj["playlistVideoRenderer"]
                    video_id = renderer.get("videoId")
                    title = renderer.get("title", {}).get("runs", [{}])[0].get("text", "Unknown")
                    if video_id:
                        videos.append((title, video_id))
                elif "lockupViewModel" in obj:
                    vm = obj["lockupViewModel"]
                    title_content = vm.get("metadata", {}).get("lockupMetadataViewModel", {}).get("title", {}).get("content", "")
                    video_id = vm.get("contentId")
                    if video_id and title_content:
                        videos.append((title_content, video_id))
                else:
                    for k, v in obj.items():
                        find_videos(v)
            elif isinstance(obj, list):
                for item in obj:
                    find_videos(item)

        find_videos(data)

    # Fallback regex tìm videoId
    fallback_ids = re.findall(r"\"videoId\":\"([^\"]+)\"", content)
    fallback_titles = re.findall(r"\"title\":\{\"runs\":\[\{\"text\":\"([^\"]+)\"\}\]", content)

    # De-duplicate maintaining order
    seen = set()
    unique_videos = []
    for title, vid in videos:
        if vid not in seen:
            seen.add(vid)
            unique_videos.append((title, vid))

    if not unique_videos:
        # Nếu dùng fallback
        unique_ids = []
        for vid in fallback_ids:
            if vid not in unique_ids and len(vid) == 11:
                unique_ids.append(vid)
        for idx, vid in enumerate(unique_ids, 1):
            unique_videos.append((f"Video {idx}", vid))

    output_lines = []
    output_lines.append(f"FOUND {len(unique_videos)} VIDEOS:")
    for idx, (title, vid) in enumerate(unique_videos, 1):
        url = f"https://www.youtube.com/watch?v={vid}"
        output_lines.append(f"{idx}. {title} - {url}")
        
    with open("playlist_result.txt", "w", encoding="utf-8") as out:
        out.write("\n".join(output_lines))
    print("SUCCESS: Results written to playlist_result.txt")
except Exception as e:
    print("Error:", e)
