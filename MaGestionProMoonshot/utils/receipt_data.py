from pydantic import BaseModel
from enum import Enum
from typing import Optional

class Category(str, Enum):
    avion = "avions"
    peage = "peages"
    essence = "essence"
    train = "trains"


class ReceiptData(BaseModel):
    category: Category
    name_of_trip: str
    type_of_transport: Optional[str]
    are_kilometers_known: bool
    number_of_kilometers: Optional[float] = None
    departure: Optional[str] = None  
    arrival: Optional[str] = None    
    number_of_trips: int

