from pydantic import BaseModel
from enum import Enum
from typing import Optional

class Category(str, Enum):
    avion = "avions"
    essence = "essence"
    train = "trains"


class ReceiptData(BaseModel):
    category: Category
    type_of_transport: Optional[str] = None
    number_of_liters: Optional[float] = None
    departure: Optional[str] = None  
    arrival: Optional[str] = None    

