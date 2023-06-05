import pandas as pd

df = pd.read_csv("ocr/model/text.csv")
df.to_json("ocr/model/data.json")