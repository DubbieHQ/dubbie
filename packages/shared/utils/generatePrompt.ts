import type { AcceptedLanguage } from "@dubbie/db";

export function generatePrompt(paragraph: string, language?: AcceptedLanguage): string {
  // if (language === "mandarin") {
  //   return `以下是视频的转录内容。
  // 我想让你将转录的内容分成单独的句子。
  // 每个句子必须少于20个字符。而且你只需要返回句子，不要添加其他内容。句子之间也不要添加空行。

  // 比如说如果我给你的内容是：
  // 我家有一个很奇葩的设计 卧室的灯要去书房开 而卧室墙上是为了遮丑 扎了假开关 当时鬼迷心窍请了路边的装修队 穿错了线 现在每天睡觉 我都要跑到隔壁去关灯 才摸黑跑回来 经常磕到脚趾 买的智能音箱总掉链子 关闪灯 设备好像有限了 我还是要时常自己去关 那天朋友送我一个袍子 我穿着它自娱自乐的时候 突然想到了一个 关灯的好办法 一周后我的脚趾消肿了 心情也变好了 因为我再也不用跑到隔壁去关灯了 是的 关灯最好的方法 就是魔法

  // 你只需要返回这些句子，不要添加其他内容：
  // <sentence>我家有一个很奇葩的设计</sentence>
  // <sentence>卧室的灯要去书房开</sentence>
  // <sentence>而卧室墙上是为了遮丑扎了假开关</sentence>
  // <sentence>当时鬼迷心窍请了路边的装修队穿错了线</sentence>
  // <sentence>现在每天睡觉我都要跑到隔壁去关灯</sentence>
  // <sentence>才摸黑跑回来经常磕到脚趾</sentence>

  // 再打个比方，如果我给你的内容是：
  // 这是一块将要滑落的土体 你可以在一侧用木板挡住 用力撑住木板 来避免土体滑落 这就是伏壁式挡土墙 聪明的你肯定会想到 如果能在另一侧 用绳子拉住木板 也能挡住滑落的土体 把这些绳子换成钢筋 注入水泥浆 让钢筋与土密切接触 就会紧紧压住钢筋 利用这巨大的摩擦力

  // 你只需要返回这些句子，不要添加其他内容：
  // <sentence>这是一块将要滑落的土体</sentence>
  // <sentence>你可以在一侧用木板挡住</sentence>
  // <sentence>用力撑住木板来避免土体滑落</sentence>
  // <sentence>这就是伏壁式挡土墙</sentence>
  // <sentence>聪明的你肯定会想到如果能在另一侧用绳子拉住木板也能挡住滑落的土体</sentence>
  // <sentence>把这些绳子换成钢筋注入水泥浆</sentence>
  // <sentence>让钢筋与土密切接触就会紧紧压住钢筋</sentence>
  // <sentence>利用这巨大的摩擦力</sentence>

  // ${paragraph}
  // `;
  // }

  return `Below is the transcription of a video.
  I want you to break the transcription into individual sentences.
  A sentence should be shorter than 20 words(or 20 characters for cases like Chinese, Japanese, or Korean).
  Please only return the sentences and absolutely nothing else.
  Do not add empty lines between sentences.
  Absolutely do not modify the original sentences in any way.
  Do not reword, remove symbols, fix errors, or make ANY changes whatsoever.
  We will apply specific regex-based transformations and need the exact original strings.
  Example output:
  <sentence>hello so this is sentence 1</sentence>
  <sentence>and this is sentence 2</sentence>
  <sentence>and this is sentence 3</sentence>
  ${paragraph}
  `;
}
