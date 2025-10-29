require("dotenv").config()
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const suggestCategory=async(req,res) =>{
    const {description}=req.body;
    try{
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Suggest what category ${description} fall under in one word. Just give me text` ,
  });
  const categoryText = result.text;
  //console.log(response.text);
  res.status(200).json({category:categoryText});
}
catch(err)
{
    res.status(500).json({message:err.message});
}
}

module.exports={
    suggestCategory
}
