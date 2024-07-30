import { uploadAudioArrayToStorage } from "@dubbie/shared/services/firebaseUploads";
import { generateAudio } from "@dubbie/shared/services/generateAudio";
import { ALL_VOICES } from "@dubbie/shared/voices";
import fs from "node:fs";
import path from "node:path";

const sentences: { [key: string]: string } = {
  english:
    "Hi there, it's a beautiful day isn't it, do you have any plans for the rest of the day?",
  mandarin: "你好，今天天气真好，你今天有什么计划吗？",
  spanish: "Hola, es un día hermoso, ¿tienes algún plan para el resto del día?",
  hindi: "नमस्ते, आज का दिन बहुत सुंदर है, क्या आपके पास आज के बाकी दिन के लिए कोई योजना है?",
  korean: "안녕하세요, 오늘 날씨가 정말 좋네요, 오늘 남은 하루 계획이 있나요?",
  arabic: "مرحبًا، إنه يوم جميل أليس كذلك، هل لديك أي خطط لبقية اليوم؟",
  portuguese: "Olá, está um dia lindo, não está? Você tem algum plano para o resto do dia?",
  bengali: "হ্যালো, আজকের দিনটি সুন্দর, আজকের বাকি দিনের জন্য আপনার কোনো পরিকল্পনা আছে কি?",
  russian:
    "Привет, сегодня прекрасный день, не так ли? У тебя есть какие-нибудь планы на оставшуюся часть дня?",
  japanese: "こんにちは、今日はとても良い天気ですね。今日は何か予定がありますか？",
  french:
    "Bonjour, c'est une belle journée, n'est-ce pas? Avez-vous des plans pour le reste de la journée?",
  german:
    "Hallo, es ist ein schöner Tag, nicht wahr? Haben Sie irgendwelche Pläne für den Rest des Tages?",
  italian: "Ciao, è una bella giornata, vero? Hai qualche piano per il resto della giornata?",
  turkish:
    "Merhaba, bugün çok güzel bir gün değil mi, günün geri kalanı için herhangi bir planınız var mı?",
  vietnamese:
    "Xin chào, hôm nay là một ngày đẹp trời phải không, bạn có kế hoạch gì cho phần còn lại của ngày không?",
  polish: "Cześć, to piękny dzień, prawda? Czy masz jakieś plany na resztę dnia?",
  ukrainian: "Привіт, сьогодні чудовий день, чи не так? У тебе є якісь плани на решту дня?",
  dutch: "Hallo, het is een mooie dag, nietwaar? Heb je nog plannen voor de rest van de dag?",
  thai: "สวัสดีค่ะ/ครับ วันนี้อากาศดีจังเลยนะคะ/ครับ คุณมีแผนอะไรสำหรับช่วงที่เหลือของวันนี้บ้างไหมคะ/ครับ?",
  urdu: "ہیلو، یہ ایک خوبصورت دن ہے، کیا نہیں؟ کیا آپ کے پاس دن کے باقی حصے کے لیے کوئی منصوبہ ہے؟",
  indonesian: "Halo, hari ini cuacanya indah ya, apakah Anda punya rencana untuk sisa hari ini?",
  punjabi:
    "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਅੱਜ ਦਾ ਦਿਨ ਬਹੁਤ ਸੋਹਣਾ ਹੈ, ਕੀ ਨਹੀਂ? ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਬਾਕੀ ਦਿਨ ਲਈ ਕੋਈ ਯੋਜਨਾ ਹੈ?",
};

export async function generateAndUploadAllVoices() {
  const results: { [key: string]: string } = {};

  for (const voice of ALL_VOICES) {
    const sentence =
      voice.language === "multilingual" ? sentences.english : sentences[voice.language];
    if (sentence) {
      try {
        const audioBuffer = await generateAudio({ text: sentence, voice });
        const audioArray = new Uint8Array(audioBuffer);
        const url = await uploadAudioArrayToStorage(audioArray, "demo-audio");
        results[voice.name] = url;
        console.log(`Uploaded ${voice.name}: ${url}`);
      } catch (error) {
        console.error(`Failed to generate or upload audio for ${voice.name}:`, error);
      }
    }
  }

  const outputPath = path.resolve(__dirname, "uploadedAudioUrls.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`Saved URLs to ${outputPath}`);

  // Update voicesData with new information
  const voicesDataPath = path.resolve(__dirname, "../../../shared/voicesData.json");
  const voicesData = JSON.parse(fs.readFileSync(voicesDataPath, "utf-8"));

  for (const voice of ALL_VOICES) {
    const provider = voice.provider.toLowerCase();
    const existingVoice = voicesData[provider].find((v: any) => v.name === voice.name);
    if (existingVoice) {
      existingVoice.exampleSoundUrl = results[voice.name] || existingVoice.exampleSoundUrl;
    }
  }

  // Create a new file with a random number suffix
  const randomSuffix = Math.floor(Math.random() * 10000);
  const newVoicesDataPath = path.resolve(
    __dirname,
    `../../../shared/voicesData-${randomSuffix}.json`
  );

  // Write the updated data to the new file
  fs.writeFileSync(newVoicesDataPath, JSON.stringify(voicesData, null, 2));
  console.log(`Updated voice data saved to ${newVoicesDataPath}`);
}
