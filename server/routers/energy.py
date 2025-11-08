# server/routers/energy.py
from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime, timedelta
import math, random
from statistics import median

router = APIRouter(prefix="/api/energy", tags=["energy"])


# ---- Response models ----
class EnergyPoint(BaseModel):
    hour: str             # ISO timestamp per hour
    carbon: float         # kg/kWh
    price: float          # ¢/kWh
    load: float | None = None  # kWh (optional; included for trend use)


class EnergyZoneResponse(BaseModel):
    zoneId: str
    load_kwh: float                 # current load
    carbon_intensity: float         # current kg/kWh (latest point)
    aqi: int
    price_cents_per_kwh: float      # current price (latest point)
    series: list[EnergyPoint]       # 24-hour series (carbon/price/+load)
    cleaner_hours_iso: list[str]    # ISO hours that are low carbon & low price


# ---- Mock generators ----
def mock_load_kwh(hour_24: int) -> float:
    """
    Simple daily load curve:
    - low overnight
    - morning ramp
    - evening peak
    - small random noise
    """
    baseline = 320.0
    # Shift sine so it peaks around ~18–20 (early evening)
    daily_wave = 160.0 * (1 + math.sin((hour_24 - 18) / 24 * 2 * math.pi))
    noise = random.random() * 10.0
    return round(max(100.0, baseline + daily_wave + noise), 0)


def build_mock_series() -> list[EnergyPoint]:
    now = datetime.utcnow().replace(minute=0, second=0, microsecond=0)
    series: list[EnergyPoint] = []

    for i in range(24):
        t = now - timedelta(hours=23 - i)
        # mock carbon & price waves with slight noise
        carbon = 0.25 + math.sin(i / 3) * 0.08 + random.random() * 0.02
        price = 9 + math.cos(i / 2.8) * 2.5 + random.random() * 0.5
        load = mock_load_kwh(t.hour)

        series.append(
            EnergyPoint(
                hour=t.isoformat() + "Z",
                carbon=round(carbon, 3),
                price=round(price, 2),
                load=load,
            )
        )
    return series


# ---- Route ----
@router.get("/zone/{zone_id}", response_model=EnergyZoneResponse)
def get_zone(zone_id: str):
    series = build_mock_series()
    latest = series[-1]

    # Current values
    now_hour = datetime.utcnow().hour
    load_now = mock_load_kwh(now_hour)

    # Cleaner hours = below median carbon AND below median price
    carbon_med = median([p.carbon for p in series])
    price_med = median([p.price for p in series])
    cleaner = [p.hour for p in series if p.carbon <= carbon_med and p.price <= price_med]

    return EnergyZoneResponse(
        zoneId=zone_id,
        load_kwh=load_now,
        carbon_intensity=latest.carbon,
        aqi=42,
        price_cents_per_kwh=latest.price,
        series=series,
        cleaner_hours_iso=cleaner,
    )
