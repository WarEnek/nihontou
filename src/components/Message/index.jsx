import { clsx } from "clsx";
import $ from "./index.module.css";

const Message = ({ text, user }) => {
	return (
		<div className={$.container}>
			<div className={clsx($.message, user && $.user)}>{text}</div>
		</div>
	);
};

export default Message;
