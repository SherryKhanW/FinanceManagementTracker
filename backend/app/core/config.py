import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    def __init__(self) -> None:
        self.supabase_url = self._get_required_env("SUPABASE_URL")
        self.supabase_anon_key = self._get_required_env("SUPABASE_ANON_KEY")
        self.database_url = self._get_required_env("DATABASE_URL")
        self.cors_allowed_origins = self._get_csv_env(
            "CORS_ALLOWED_ORIGINS",
            ["http://localhost:3000"],
        )

    @staticmethod
    def _get_required_env(name: str) -> str:
        value = os.getenv(name)
        if not value:
            raise RuntimeError(f"Missing required environment variable: {name}")

        return value

    @staticmethod
    def _get_csv_env(name: str, default: list[str]) -> list[str]:
        value = os.getenv(name)

        if not value:
            return default

        return [
            item.strip()
            for item in value.split(",")
            if item.strip()
        ]

settings = Settings()
