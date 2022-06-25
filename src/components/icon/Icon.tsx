//svg 
import { ReactComponent as House } from "assets/icons/house.svg";
import { ReactComponent as HouseFill } from "assets/icons/house-fill.svg";
import { ReactComponent as ChatFill } from "assets/icons/chat-square-dots-fill.svg";
import { ReactComponent as Chat } from "assets/icons/chat-square-dots.svg";
import { ReactComponent as Lock } from "assets/icons/lock-fill.svg";
import { ReactComponent as Protected } from "assets/icons/protected.svg";
import { ReactComponent as Person } from "assets/icons/person-fill.svg";
import { ReactComponent as PersonCircle } from "assets/icons/person-circle.svg";
import { ReactComponent as Text } from "assets/icons/text-fill.svg";
import { ReactComponent as ArrowDown } from "assets/icons/arrow-down.svg";
import { ReactComponent as Options } from "assets/icons/options.svg";
import { ReactComponent as Doctor } from "assets/icons/doctor.svg";
import { ReactComponent as Appoint } from "assets/icons/appoint.svg";
import { ReactComponent as History } from "assets/icons/history.svg";

export interface Props {
  name: string;
  color: string;
  size: number;
  button?: boolean;
  btnClassName?: string;
  iconClassName?: string;
  svg?: boolean;
  extname?: string;
  onClick?: () => void;
}

const Icon: React.FC<Props> = ({
  name,
  size,
  color,
  iconClassName,
  button,
  btnClassName,
  svg,
  extname = 'svg',
  onClick,
}) => {
  // use img to export svg

  if(!svg){
    if (button) {
      return (
        <button className={`${btnClassName} btn`} onClick={onClick}>
          <img
            src={require(`assets/icons/${name}.${extname}`)}
            alt={name}
            width={size}
            height={size}
            className={`${iconClassName}`}
          />
        </button>
      );
    }
    return (
      <img
        src={require(`assets/icons/${name}.${extname}`)}
        width={size}
        height={size}
        alt={name}
        className={`${iconClassName}`}
      />
    );
  }else{
    switch(name){
      case "house":
        return <House width={size} height={size} fill={color} />;
      case "house-fill":
        return <HouseFill width={size} height={size} fill={color} />;
      case "chat-fill":
        return <ChatFill width={size} height={size} fill={color} />;
      case "chat":
        return <Chat width={size} height={size} fill={color} />;
      case "lock-fill":
        return <Lock width={size} height={size} fill={color} />;
      case "protected":
        return <Protected width={size} height={size} fill={color} />;
      case "person-fill":
        return <Person width={size} height={size} fill={color} />;
      case "person-circle":
        return <PersonCircle width={size} height={size} fill={color} />;
      case "text-fill":
        return <Text width={size} height={size} fill={color} />;
      case "arrow-down":
        return <ArrowDown width={size} height={size} fill={color} />;
      case "options":
        return <Options width={size} height={size} fill={color} />;
      case "doctor":
        return <Doctor width={size} height={size} fill={color} />;
      case "appoint":
        return <Appoint width={size} height={size} fill={color} />;
      case "history":
        return <History width={size} height={size} fill={color} />;
      default:
        return <House width={size} height={size} fill={color} />;
    }
  }
};

export default Icon;
