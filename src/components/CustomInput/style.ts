import styled from "styled-components";
import { FieldStyleBasicProps } from "../FormControl";
import { secondaryDark3 } from "../GlobalStyle";

interface InputStyleProps extends FieldStyleBasicProps {
  fontSize: string;
  fontFamily: string;
  border: string;
  padding: string;
  placeholderFont: string;
  placeholderFamily: string;
  marginBottom: string;
  borderRadius: string;
  labelFont: string;
  labelMarginBottom: string;
  labelFamily: string;
}
const CustomInputStyle = styled.div<InputStyleProps>`
  width: 100%;

  label {
    display: block;
    color: ${secondaryDark3};
    text-transform: capitalize;
    font-size: ${(props) => props.labelFont};
    font-family: ${(props) => props.labelFamily};
    margin-bottom: ${(props) => props.labelMarginBottom};
  }

  .customInput {
    border-radius: 10px !important;
    margin-bottom: 0px !important;
  }
  .ant-input {
    padding: ${(props) => props.padding} !important;
    border: "none";
    font-family: ${(props) => props.fontFamily};
    font-size: ${(props) => props.fontSize};
    border-radius: ${(props) => props.borderRadius};
    &::placeholder {
      font-family: ${(props) => props.placeholderFamily};
      font-size: ${(props) => props.placeholderFont};
    }
  }
`;

export default CustomInputStyle;
