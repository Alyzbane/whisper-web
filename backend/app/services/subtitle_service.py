from typing import Dict, List, Any, Callable, Optional
import re
from app.schemas.transcription import SubtitleFormat
from app.core.logging import log_error


class SubtitleService:
    """Service for generating subtitles in different formats."""
    
    def __init__(self, format_type: str = "srt"):
        """
        Initialize subtitle service.
        
        Args:
            format_type: The subtitle format (srt, vtt, txt)
        """
        self.ext = format_type
        
        # Define format configurations
        sub_dict = {
            "srt": SubtitleFormat(
                coma=",",
                header="",
                format=lambda i, segment: f"{i + 1}\n{self.timeformat(segment['timestamp'][0])} --> {self.timeformat(segment['timestamp'][1] if segment['timestamp'][1] is not None else segment['timestamp'][0])}\n{segment['text']}\n\n",
            ),
            "vtt": SubtitleFormat(
                coma=".",
                header="WebVTT\n\n",
                format=lambda i, segment: f"{self.timeformat(segment['timestamp'][0])} --> {self.timeformat(segment['timestamp'][1] if segment['timestamp'][1] is not None else segment['timestamp'][0])}\n{segment['text']}\n\n",
            ),
            "txt": SubtitleFormat(
                coma="",
                header="",
                format=lambda i, segment: f"{segment['text']}\n",
            ),
        }

        self.coma = sub_dict[format_type].coma
        self.header = sub_dict[format_type].header
        self.format = sub_dict[format_type].format

    def timeformat(self, time: float) -> str:
        """
        Format time in the appropriate subtitle format.
        
        Args:
            time: Time in seconds
            
        Returns:
            Formatted time string
        """
        hours = time // 3600
        minutes = (time - hours * 3600) // 60
        seconds = time - hours * 3600 - minutes * 60
        milliseconds = (time - int(time)) * 1000
        return f"{int(hours):02d}:{int(minutes):02d}:{int(seconds):02d}{self.coma}{int(milliseconds):03d}"
    
    @log_error
    def get_subtitle(self, segments: List[Dict]) -> str:
        """
        Generate subtitle text from segments.
        
        Args:
            segments: List of transcription segments
            
        Returns:
            Generated subtitle text
        """
        output = self.header
        for i, segment in enumerate(segments):
            # Clean up text by removing leading space
            if segment['text'].startswith(' '):
                segment['text'] = segment['text'][1:]
            try:
                output += self.format(i, segment)
            except Exception as e:
                print(e, segment)
            
        return output
    
    @log_error
    def write_subtitle(self, segments: List[Dict], output_file: str) -> str:
        """
        Write subtitle to file.
        
        Args:
            segments: List of transcription segments
            output_file: Output file path without extension
            
        Returns:
            Path to the written file
        """
        full_path = f"{output_file}.{self.ext}"
        subtitle = self.get_subtitle(segments)

        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(subtitle)
            
        return full_path
