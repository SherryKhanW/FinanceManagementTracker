import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    def __init__(self) -> None:
        self.supabase_url = self._get_required_env("SUPABASE_URL")
        self.supabase_anon_key = self._get_required_env("SUPABASE_ANON_KEY")
        self.database_url = self._get_required_env("DATABASE_URL")
    @staticmethod
    def _get_required_env(name: str) -> str:
        value = os.getenv(name)
        if not value:
            raise RuntimeError(f"Missing required environment variable: {name}")

        return value

settings = Settings()
