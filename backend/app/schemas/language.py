from pydantic import BaseModel
from typing import Optional


class Language(BaseModel):
    """Model for language data."""
    code: str
    name: str

    def __str__(self) -> str:
        return f"Language(code={self.code}, name={self.name})"


# List of available languages for transcription/translation
LANGUAGES = [
    Language(code='en', name='English'),
    Language(code='zh', name='Chinese'),   
    Language(code='de', name='German'),    
    Language(code='es', name='Spanish'),   
    Language(code='ru', name='Russian'),   
    Language(code='ko', name='Korean'),    
    Language(code='fr', name='French'),    
    Language(code='ja', name='Japanese'),  
    Language(code='pt', name='Portuguese'),
    Language(code='tr', name='Turkish'),   
    Language(code='pl', name='Polish'),    
    Language(code='ca', name='Catalan'),   
    Language(code='nl', name='Dutch'),     
    Language(code='ar', name='Arabic'),
    Language(code='sv', name='Swedish'),
    Language(code='it', name='Italian'),
    Language(code='id', name='Indonesian'),
    Language(code='hi', name='Hindi'),
    Language(code='fi', name='Finnish'),
    Language(code='vi', name='Vietnamese'),
    Language(code='he', name='Hebrew'),
    Language(code='uk', name='Ukrainian'),
    Language(code='el', name='Greek'),
    Language(code='ms', name='Malay'),
    Language(code='cs', name='Czech'),
    Language(code='ro', name='Romanian'),
    Language(code='da', name='Danish'),
    Language(code='hu', name='Hungarian'),
    Language(code='ta', name='Tamil'),
    Language(code='no', name='Norwegian'),
    Language(code='th', name='Thai'),
    Language(code='ur', name='Urdu'),
    Language(code='hr', name='Croatian'),
    Language(code='bg', name='Bulgarian'),
    Language(code='lt', name='Lithuanian'),
    Language(code='la', name='Latin'),
    Language(code='mi', name='Maori'),
    Language(code='ml', name='Malayalam'),
    Language(code='cy', name='Welsh'),
    Language(code='sk', name='Slovak'),
    Language(code='te', name='Telugu'),
    Language(code='fa', name='Persian'),
    Language(code='lv', name='Latvian'),
    Language(code='bn', name='Bengali'),
    Language(code='sr', name='Serbian'),
    Language(code='az', name='Azerbaijani'),
    Language(code='sl', name='Slovenian'),
    Language(code='kn', name='Kannada'),
    Language(code='et', name='Estonian'),
    Language(code='mk', name='Macedonian'),
    Language(code='br', name='Breton'),
    Language(code='eu', name='Basque'),
    Language(code='is', name='Icelandic'),
    Language(code='hy', name='Armenian'),
    Language(code='ne', name='Nepali'),
    Language(code='mn', name='Mongolian'),
    Language(code='bs', name='Bosnian'),
    Language(code='kk', name='Kazakh'),
    Language(code='sq', name='Albanian'),
    Language(code='sw', name='Swahili'),
    Language(code='gl', name='Galician'),
    Language(code='mr', name='Marathi'),
    Language(code='pa', name='Punjabi'),
    Language(code='si', name='Sinhala'),
    Language(code='km', name='Khmer'),
    Language(code='sn', name='Shona'),
    Language(code='yo', name='Yoruba'),
    Language(code='so', name='Somali'),
    Language(code='af', name='Afrikaans'),
    Language(code='oc', name='Occitan'),
    Language(code='ka', name='Georgian'),
    Language(code='be', name='Belarusian'),
    Language(code='tg', name='Tajik'),
    Language(code='sd', name='Sindhi'),
    Language(code='gu', name='Gujarati'),
    Language(code='am', name='Amharic'),
    Language(code='yi', name='Yiddish'),
    Language(code='lo', name='Lao'),
    Language(code='uz', name='Uzbek'),
    Language(code='fo', name='Faroese'),
    Language(code='ht', name='Haitian creole'),
    Language(code='ps', name='Pashto'),
    Language(code='tk', name='Turkmen'),
    Language(code='nn', name='Nynorsk'),
    Language(code='mt', name='Maltese'),
    Language(code='sa', name='Sanskrit'),
    Language(code='lb', name='Luxembourgish'),
    Language(code='my', name='Myanmar'),
    Language(code='bo', name='Tibetan'),
    Language(code='tl', name='Tagalog'),
    Language(code='mg', name='Malagasy'),
]

def get_language_by_code(code: str) -> Optional[Language]:
    """Get a language by its code.
    
    Args:
        code: The language code to look up
        
    Returns:
        The Language object if found, None otherwise
    """
    for language in LANGUAGES:
        if language.code == code:
            return language
    return None
