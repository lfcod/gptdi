export const currentEnv = process.env.INIT_ENV || "prod";
export const isProd = process.env.INIT_ENV === "prod";

export const BASE_URL = `https://api.fe8.cn`;

const ctext = currentEnv !== "prod" ? `DEVCTO ${currentEnv}` : "DEVCTO";

// 登录token
export const tokenKey = "token";

// 微信appid，测试 wx847c9937877744e5
export const appid = "wx45ecf372ff70d541";

export const open_key = "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";

console.info(
  `\n %c ${ctext} %c https://lanmeidao.com \n`,
  "color: #fff; background: red; padding:5px 0; font-size:12px;font-weight: bold;",
  "background: #03a8e8; padding:5px 0; font-size:12px;",
);

const defualtUrl = "https://codeapi.xixibot.com";
const urlEnv = {
  prod: " https://codeapi.xixibot.com",
  dev: "https://testapi.devcto.com",
  test: "https://testapi.devcto.com",
};

export const baseUrl = urlEnv[currentEnv] || defualtUrl;
