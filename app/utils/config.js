const DEFAULT_COUNT = 10;

// 验证是否有AppId&APPscre
// 验证当前次数

// 次数够 +1

// 次数不够
// 提醒填写appid

//  验证文本是否合规

import fetch from "node-fetch";

const verAppMessage = () => {
  let appMessage = localStorage.getItem("access-control");
  if (appMessage) {
    appMessage = JSON.parse(appMessage);
  }
  // 如果有APPID和密钥 放行
  if (appMessage.appid && appMessage.appsecret) {
    return true;
  }
  return false;
};

const verMessage = async (value) => {
  if (verAppMessage) {
    return;
  }
  const fetch = await fetch(``);
};

// 获取代码 流方式
export const openAi = async (data, options) => {
  let xtextContent = "";
  // @ts-ignore;
  EventSource = SSE;
  var apiUrl = `https://api.fe8.cn/v1/chat/account`;
  // const apiUrl = "https://api.openaixx.com/v1/inner/search";
  var params = {
    model: data?.model,
    // prompt: data,
    // max_tokens: 2000,
    // temperature: 0.1,
    // top_p: 1,
    // stream: true,
    // frequency_penalty: 0,
    // presence_penalty: 0,
    message: data?.message,
    // apiKey: "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",
    // modelId: data?.modelId,
  };

  let accessMessage = localStorage.getItem("access-control");
  accessMessage = JSON.parse(accessMessage);
  const evtSource = new EventSource(apiUrl, {
    // @ts-ignore
    headers: {
      //   Authorization: "Bearer " + window.localStorage.getItem("token"),
      appid: accessMessage.appid,
      appsecret: accessMessage.appsecret,
      // Authorization:
      //   "Bearer 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",
      "Content-Type": "application/json",
    },
    method: "POST",
    payload: JSON.stringify(params),
    // payload: params,
  });

  //    source.addEventListener('status', function(e) {
  //        console.log('System status is now: ' + e.data);
  //    });

  // console.log(evtSource.readyState, "aareadyState");
  // console.log(evtSource.url, "aaurl");
  // evtSource.CONNECTING

  evtSource.onopen = function () {
    console.log("Connection to server opened.");
  };

  evtSource.onmessage = async function (e) {
    const msg = e?.data;

    if (msg.indexOf("[DONE]") !== -1) {
      console.log("readEnd");
      evtSource.close();
      options.onEnd({ content: xtextContent });
      return;
    }
    const resultData = JSON.parse(e?.data || "{}");

    // console.log("resultData", e);
    xtextContent += resultData?.choices?.[0]?.delta?.content || "";
    options.onMessage({ content: xtextContent });
  };

  evtSource.onerror = function () {
    console.log("EventSource failed.");
  };

  evtSource.addEventListener(
    "ping",
    function (e) {
      console.log("ping");
      console.log(e.data, "pingData");
    },
    false,
  );
  // @ts-ignore;
  evtSource.stream();

  return {
    code: 0,
    data: { content: "" },
  };
};
