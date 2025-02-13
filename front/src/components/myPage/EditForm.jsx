import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  DatePicker,
  message,
  Modal,
} from "antd";
import moment from "moment";
import styled from "styled-components";
import { customMedia } from "../../GlobalStyles";
import Button from "../common/Button.jsx";

const EditForm = ({ ...props }) => {
  const [editForm] = Form.useForm();
  const [inputText, setInputText] = useState("");
  const tags = ["NETFLIX", "WATCHA", "DISNEY+", "WAVVE"];

  const userId = localStorage.getItem("user_id");
  const ref = useRef();
  const onChange = (e) => {
    setInputText(e.target.value);
  };

  const sendData = async (values) => {
    const startDate = values.date[0]._d.toISOString().substring(0, 10);
    const endDate = values.date[1]._d.toISOString().substring(0, 10);

    if (!values.requiredPerson) {
      message.error("참여인원을 입력해주세요.");
      return;
    }

    if (values.title.length > 10) {
      message.warning("이름은 10자까지 입력 가능합니다.");
      return;
    }

    if (values.contents.length > 40) {
      message.warning("한 줄 소개는 40자까지 입력 가능합니다.");
      return;
    }

    const data = {
      title: values.title,
      contents: values.contents,
      requiredPerson: values.requiredPerson,
      startDate: startDate,
      endDate: endDate,
    };

    try {
      const res = await axios

        .put(
          process.env.REACT_APP_API_URL +
            `/clubs/users/${props.selectedClubId}`,
          JSON.stringify(data),
          {
            headers: {
              "Content-Type": `application/json`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            editForm.resetFields();
            message.success("모임이 성공적으로 수정되었습니다!");
            props.onCancel();
          } else {
            message.error("모임 수정에 실패했습니다.");
          }
        });
    } catch (err) {
      console.log(err);
    }

    console.log(JSON.stringify(data));
  };

  const onFinish = async (values) => {
    sendData(values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed: ", errorInfo);
  };

  const disabledDate = (current) => current && current < moment().endOf("day");

  return (
    <Wrapper>
      <StyledForm
        form={editForm}
        name="editForm"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={32}>
          <Col span={16}>
            <Form.Item
              initialValue={props.selectedClubTitle}
              onChange={() => {
                // console.log('title : ' + props.abc);
                // console.log('title : ' + props.selectedClubTitle);
              }}
              label="이름"
              name="title"
              rules={[{ required: true, message: "모임 이름을 입력하세요." }]}
            >
              <StyledInput placeholder="모임 이름"></StyledInput>
            </Form.Item>
            <Form.Item
              initialValue={props.selectedClubContents}
              label="한 줄 소개"
              name="contents"
              rules={[
                {
                  required: true,
                  message: "모임의 한 줄 소개를 입력하세요.",
                },
              ]}
            >
              <StyledInput placeholder="한 줄 소개"></StyledInput>
            </Form.Item>
            <Form.Item
              label="참여 인원"
              rules={[
                {
                  required: true,
                  message: "모임의 참여 인원을 입력하세요.",
                },
              ]}
            >
              <Row>
                <PersonnelRow>
                  <Form.Item
                    name="requiredPerson"
                    initialValue={props.selectedClubRequiredPerson}
                  >
                    <StyledInputNumber min={2} max={4} placeholder={2} />
                  </Form.Item>
                  <StyledSpan>인</StyledSpan>
                </PersonnelRow>
              </Row>
            </Form.Item>
            <Form.Item
              initialValue={[
                moment(props.selectedClubStartDate),
                moment(props.selectedClubEndDate),
              ]}
              label="진행 기간"
              name="date"
              rules={[
                {
                  type: "array",
                  required: "true",
                  message: "모임의 진행 기간을 입력하세요.",
                },
              ]}
            >
              <StyledRangePicker
                disabledDate={disabledDate}
              ></StyledRangePicker>
            </Form.Item>
          </Col>
        </Row>

        <ButtonRow>
          <FilledBtn>수정</FilledBtn>
        </ButtonRow>
      </StyledForm>
    </Wrapper>
  );
};

export default EditForm;

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const Wrapper = styled.section`
  width: 1200px;
  padding: 40px 100px;
  margin: 0 auto;
  ${customMedia.lessThan("mobile")`
    width: 295px;
    padding: 3px;
  `}
  ${customMedia.between("mobile", "largeMobile")`
    width: 363px;
    padding: 5px;
  `}
	${customMedia.between("largeMobile", "tablet")`
    width: 610px;
    padding: 10px 20px;
  `}
	${customMedia.between("tablet", "desktop")`
    width: 880px;
    padding: 20px 50px;
  `}
`;

const StyledForm = styled(Form)`
  .ant-form-item-label > label {
    font-size: 18px;
    font-weight: bold;
    ${customMedia.lessThan("mobile")`
      font-size: 10px;
    `}
    ${customMedia.between("mobile", "largeMobile")`
      font-size: 10px;
    `}
    ${customMedia.between("largeMobile", "tablet")`
      font-size: 14px;
    `}
    ${customMedia.between("tablet", "desktop")`
      font-size: 16px;
    `}
  }
  .ant-form-item {
    margin-bottom: 20px;
  }
  .ant-input:focus,
  .ant-input-focused,
  .ant-input:hover,
  .ant-input-number:hover,
  .ant-picker:hover,
  .ant-picker-focused {
    border-color: #029400;
    box-shadow: none;
  }
`;

const StyledInput = styled(Input)`
  font-size: 16px;
  height: 48px;
  background-color: #f6f6f6;
  border: 1px solid #94989b;
  border-radius: 5px;
  ${customMedia.lessThan("mobile")`
    font-size: 10px;
    height: 28px;
  `}
  ${customMedia.between("mobile", "largeMobile")`
    font-size: 10px;
    height: 28px;
  `}
  ${customMedia.between("largeMobile", "tablet")`
    font-size: 12px;
    height: 32px;
  `}
  ${customMedia.between("tablet", "desktop")`
    font-size: 14px;
    height: 40px;
  `}
`;

const StyledInputNumber = styled(InputNumber)`
  font-weight: bold;
  font-size: 16px;
  width: 80px;
  height: 40px;
  background-color: #f6f6f6;
  border: 1px solid #94989b;
  border-radius: 5px;
  .ant-input-number-input-wrap,
  .ant-input-number-input {
    height: 100%;
  }
  ${customMedia.lessThan("mobile")`
    font-size: 10px;
    width: 60px;
    height: 28px;
  `}
  ${customMedia.between("mobile", "largeMobile")`
    font-size: 10px;
    width: 60px;
    height: 28px;
  `}
  ${customMedia.between("largeMobile", "tablet")`
    font-size: 12px;
    width: 50px;
    height: 25px;
  `}
  ${customMedia.between("tablet", "desktop")`
    font-size: 14px;
    width: 60px;
    height: 30px;
  `}
`;

const PersonnelRow = styled.div`
  display: flex;
  gap: 1px;
`;

const StyledSpan = styled.span`
  align-self: center;
  margin: 0 5px;
  ${customMedia.lessThan("mobile")`
    font-size: 10px;
  `}
  ${customMedia.between("mobile", "largeMobile")`
    font-size: 10px;
  `}
  ${customMedia.between("largeMobile", "tablet")`
    font-size: 12px;
  `}
  ${customMedia.between("tablet", "desktop")`
    font-size: 14px;
  `}
`;

const TitleRow = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin: 30px 0;
  ${customMedia.lessThan("mobile")`
    font-size: 12px;
  `}
  ${customMedia.between("mobile", "largeMobile")`
    font-size: 12px;
  `}
  ${customMedia.between("largeMobile", "tablet")`
    font-size: 14px;
  `}
  ${customMedia.between("tablet", "desktop")`
    font-size: 16px;
  `}
`;

const StyledRangePicker = styled(RangePicker)`
  height: 48px;
  background-color: #f6f6f6;
  border: 1px solid #94989b;
  border-radius: 5px;
  ${customMedia.lessThan("mobile")`
    height: 28px;
  `}
  ${customMedia.between("mobile", "largeMobile")`
    height: 28px;
  `}
  ${customMedia.between("largeMobile", "tablet")`
    height: 32px;
  `}
  ${customMedia.between("tablet", "desktop")`
    height: 40px;
  `}
  .ant-picker-input > input {
    font-size: 16px;
    text-align: center;
    ${customMedia.lessThan("mobile")`
      font-size: 10px;
    `}
    ${customMedia.between("mobile", "largeMobile")`
      font-size: 10px;
    `}
    ${customMedia.between("largeMobile", "tablet")`
      font-size: 12px;
    `}
    ${customMedia.between("tablet", "desktop")`
      font-size: 14px;
    `}
  }
  .ant-picker-active-bar {
    background: #f98404;
  }
`;

// const FileInput = styled.div`
//   background-color: #f6f6f6;
//   border: 1px solid #94989b;
//   border-radius: 5px;
//   padding: 10px;
//   width: 250px;

//   ${customMedia.lessThan("mobile")`
//     font-size: 10px;
//     padding: 0;
//     width: 130px;
//   `}
//   ${customMedia.between("mobile", "largeMobile")`
//     font-size: 10px;
//     padding: 0;
//     width: 130px;
//   `}
//   ${customMedia.between("largeMobile", "tablet")`
//     font-size: 12px;
//     padding: 3px;
//     width: 170px;
//   `}

//   ${customMedia.between("tablet", "desktop")`
//     font-size: 14px;
//     padding: 5px;
//   `}
// `;

// const StyledTextArea = styled(TextArea)`
//   font-size: 16px;
//   width: 700px;
//   background-color: #f6f6f6;
//   border: 1px solid #94989b;
//   border-radius: 5px;
//   ${customMedia.lessThan("mobile")`
//     font-size: 10px;
//   `}
//   ${customMedia.between("mobile", "largeMobile")`
//     font-size: 10px;
//   `}

//   ${customMedia.between("largeMobile", "tablet")`
//     font-size: 12px;
//   `}

//   ${customMedia.between("tablet", "desktop")`
//     font-size: 14px;
//   `}
// `;

const TagRow = styled(Row)`
  margin-top: 20px;
`;

const TagTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 7px;
  ${customMedia.lessThan("mobile")`
    font-size: 10px;
  `}
  ${customMedia.between("mobile", "largeMobile")`
    font-size: 10px;
  `}
  ${customMedia.between("largeMobile", "tablet")`
    font-size: 14px;
  `}
  ${customMedia.between("tablet", "desktop")`
    font-size: 16px;
  `};
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  ${customMedia.lessThan("mobile")`
    gap: 2px;
  `}
  ${customMedia.between("mobile", "largeMobile")`
    gap: 3px;
  `}
	${customMedia.between("largeMobile", "tablet")`
    gap: 5px;
  `}
`;

// const PreviewImage = styled.img`
//   width: 263px;
//   height: 263px;
//   border: none;
//   border-radius: 50%;
//   position: relative;
//   ${customMedia.lessThan("mobile")`
//     width: 85px;
//     height: 85px;
//   `}
//   ${customMedia.between("mobile", "largeMobile")`
//     width: 100px;
//     height: 100px;
//   `}
//   ${customMedia.between("largeMobile", "tablet")`
//     width: 120px;
//     height: 120px;
//   `}
//   ${customMedia.between("tablet", "desktop")`
//     width: 180px;
//     height: 180px;
//   `}
// `;

// const TrashBtn = styled.div`
//   width: 24px;
//   height: 24px;
//   cursor: pointer;
//   z-index: 10;
//   position: absolute;
//   top: 10%;
//   right: 25%;

//   ${customMedia.lessThan("mobile")`
//     width: 10px;
//     height: 10px;
//     top: 5%;
//     right: 15%;
//   `}
//   ${customMedia.between("mobile", "largeMobile")`
//     width: 12px;
//     height: 12px;
//     top: 5%;
//   `}
//   ${customMedia.between("largeMobile", "tablet")`
//     width: 18px;
//     height: 18px;
//   `}
// 	img {
//     width: 100%;
//     height: 100%;
//   }
// `;

const ButtonRow = styled(Row)`
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 88px;
`;

// const MapWrapper = styled.div`
//   width: 1000px;
//   height: 250px;
//   margin-top: 40px;
//   ${customMedia.lessThan("mobile")`
//     width: 282px;
//     height: 200px;
//   `}
//   ${customMedia.between("mobile", "largeMobile")`
//     width: 350px;
//     height: 200px;
//   `}
//   ${customMedia.between("largeMobile", "tablet")`
//     width: 567px;
//   `}
//   ${customMedia.between("tablet", "desktop")`
//     width: 777px;
//   `}
// `;

const FilledBtn = styled(Button)`
  & {
    color: #ffffff;
    background-color: #029400;
    border: none;
    border-radius: 6px;
    outline: none;
    ${customMedia.lessThan("mobile")`
      font-size: 10px;
    `}
    ${customMedia.between("mobile", "largeMobile")`
      font-size: 10px;
    `}
    ${customMedia.between("largeMobile", "tablet")`
      font-size: 12px;
    `}
    ${customMedia.between("tablet", "desktop")`
      font-size: 16px;
    `}
  }
`;

const UnfilledBtn = styled(Button)`
  & {
    color: #029400;
    background-color: #ffffff;
    border: 2px solid #029400;
    border-radius: 6px;
    ${customMedia.lessThan("mobile")`
      font-size: 10px;
    `}
    ${customMedia.between("mobile", "largeMobile")`
      font-size: 10px;
    `}
    ${customMedia.between("largeMobile", "tablet")`
      font-size: 12px;
    `}
    ${customMedia.between("tablet", "desktop")`
      font-size: 16px;
    `}
  }
`;

// const SkeletonImg = styled(Skeleton.Image)`
//   .ant-skeleton-image {
//     width: 263px;
//     height: 263px;
//     border-radius: 50%;
//     ${customMedia.lessThan("mobile")`
//       width: 85px;
//       height: 85px;
//     `}
//     ${customMedia.between("mobile", "largeMobile")`
//       width: 100px;
//       height: 100px;
//   `}
//     ${customMedia.between("largeMobile", "tablet")`
//       width: 120px;
//       height: 120px;
//     `}
//     ${customMedia.between("tablet", "desktop")`
//       width: 180px;
//       height: 180px;
//     `}
//   }
// `;

const NavRegister = styled.div`
  width: 48px;
  height: 48px;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
  ${customMedia.lessThan("mobile")`
    width: 28px;
    height: 28px;
  `}
  ${customMedia.between("mobile", "largeMobile")`
    width: 30px;
    height: 30px;
  `}
	${customMedia.between("largeMobile", "tablet")`
    width: 32px;
    height: 32px;
  `}
`;

const StyledModal = styled(Modal)`
  display: flex;
  justify-content: center;
  .ant-modal-content {
    padding: 30px 55px;
    display: flex;
    align-items: center;
    ${customMedia.lessThan("mobile")`
      padding: 10px;
    `}
    ${customMedia.between("mobile", "largeMobile")`
      padding: 10px 15px;
    `}
    ${customMedia.between("largeMobile", "tablet")`
      padding: 20px 35px;
    `}
  }
  .ant-modal-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 48px;
    ${customMedia.lessThan("mobile")`
      gap: 24px;
      padding: 15px;
    `}
    ${customMedia.between("mobile", "largeMobile")`
      gap: 26px;
    `}
    ${customMedia.between("largeMobile", "tablet")`
      gap: 32px;
    `}
  }
  .ant-modal-footer {
    display: none;
  }
`;
