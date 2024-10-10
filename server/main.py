from fastapi import FastAPI, File, UploadFile
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tüm domainlere izin verir. Yalnızca belirli domainlere izin vermek için "*"'ı değiştirin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def compare_excel_files(left_file: UploadFile, right_file: UploadFile):
    left_df = pd.read_excel(left_file.file)
    right_df = pd.read_excel(right_file.file)

    only_in_left = left_df[~left_df.isin(right_df)].dropna()
    only_in_right = right_df[~right_df.isin(left_df)].dropna()

    return {
        "only_in_left": only_in_left.to_dict(orient="records"),
        "only_in_right": only_in_right.to_dict(orient="records")
    }

@app.post("/compare")
async def compare_files(
    left_file: UploadFile = File(...),
    right_file: UploadFile = File(...)
):
    result = compare_excel_files(left_file, right_file)
    return result
