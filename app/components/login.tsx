import React, { useState, useEffect } from "react";
import { Modal, Button, Text, Input, Loading } from "@nextui-org/react";
import { VerifiedOutlined, SendOutlined } from "@ant-design/icons";
import { Mail } from "./baseIcon/index";
import { toast as Toast } from "react-toastify";
import { getEmailCode, login } from "../api/login";
import { vaildEmail } from "../utils/index";

const BRAND_TITLE = "DEVGPT";

export default function LoginModal({ visible, setVisible }) {
  const [sendLoading, setSendLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const closeHandler = () => {
    setVisible(false);
  };
  const handleSendCode = async () => {
    if (!vaildEmail(email)) {
      Toast.error("请检查您的邮箱格式");
      return;
    }
    if (isCodeSent) return;

    setSendLoading(true);
    const res = await getEmailCode({
      email: email,
    });
    setSendLoading(false);
    setIsCodeSent(true);

    if (res?.code === 0) {
      Toast.success("验证码发送成功～");
    } else {
      Toast.error(res?.message);
    }
    // TODO: Implement code sending logic here
  };

  const onSubmit = async () => {
    const params = {
      email,
      verify_code: code,
    };
    if (!email || !code || submitLoading) return;
    setSubmitLoading(true);
    const res = await login(params);
    setSubmitLoading(false);
    console.log("res", res);
    if (res?.code !== 0) {
      Toast.error(res?.message || "登录失败～");
      return;
    }
    if (res?.code === 0) {
      localStorage.setItem("token", res?.data?.access_token);
      setVisible(false);
      location.reload();
      Toast.success("登录成功～");
    }
  };

  useEffect(() => {
    let timer;
    if (isCodeSent && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCountdown(60);
      setIsCodeSent(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, isCodeSent]);

  return (
    <div>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            欢迎登录
            <Text b size={18}>
              {BRAND_TITLE}
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Input
            clearable
            bordered
            onChange={(e) => setEmail(e?.target?.value)}
            fullWidth
            color="primary"
            size="lg"
            placeholder="请输入您的邮箱"
            contentLeft={<Mail fill="currentColor" />}
          />
          <Input
            onChange={(e) => setCode(e?.target?.value)}
            clearable
            bordered
            fullWidth
            color="primary"
            size="lg"
            placeholder="验证码"
            contentLeft={<VerifiedOutlined />}
            contentRight={
              <Button
                disabled={sendLoading || isCodeSent}
                onClick={handleSendCode}
                style={{
                  width: "40px",
                  position: "relative",
                  left: "-38px",
                }}
                auto
              >
                {sendLoading ? (
                  <Loading type="points" color="currentColor" size="sm" />
                ) : isCodeSent ? (
                  `${countdown} s`
                ) : (
                  "发送"
                )}
              </Button>
            }
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={!email || !code || submitLoading}
            auto
            onPress={onSubmit}
          >
            {submitLoading ? (
              <Loading type="points" color="currentColor" size="sm" />
            ) : (
              "登录并注册"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
