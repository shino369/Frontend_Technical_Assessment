import { Dropdown } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import "./CustomDropdown.scss";
import TrashIcon from "@rsuite/icons/Trash";
import { Icon } from "components";
interface Props {
  icon: string;
  size: number;
  color: string;
  data: string[];
  onPress: (item: string) => void;
}

const CustomDropdown: React.FC<Props> = ({
  icon,
  size,
  color,
  data,
  onPress,
}) => {
  const renderIconButton = (props: any, ref: any) => {
    return (
      //   <IconButton
      //     {...props}
      //     ref={ref}
      //     icon={<Icon svg name={icon} size={size} color={color} />}
      //     circle
      //     size={'xs'}
      //     appearance="ghost"
      //   />
      <div {...props} ref={ref}>
        <Icon svg name={icon} size={size} color={color} />
      </div>
    );
  };

  //   const renderMenu = (
  //     {
  //       onClose,
  //       left,
  //       top,
  //       className,
  //     }: { onClose: any; left: any; top: any; className: string },
  //     ref: any
  //   ) => {
  //     const handleSelect = (eventKey: any) => {
  //       onClose();
  //       onPress(eventKey);
  //     };
  //     return (
  //       <Popover ref={ref} className={className} style={{ left, top }} full>
  //         <Dropdown.Menu onSelect={handleSelect}>
  //           {data.map((item: string, index: number) => (
  //             <Dropdown.Item key={index} eventKey={item}>{item}</Dropdown.Item>
  //           ))}
  //         </Dropdown.Menu>
  //       </Popover>
  //     );
  //   };

  return (
    <Dropdown placement="leftStart" renderToggle={renderIconButton}>
      {data.map((item, index) => (
        <Dropdown.Item
          icon={<TrashIcon />}
          key={index}
          onClick={() => {
            onPress(item);
          }}
        >
          {item}
        </Dropdown.Item>
      ))}
    </Dropdown>
    // <Whisper placement="bottomEnd" trigger="click" speaker={renderMenu}>
    //   <IconButton
    //     size="xs"
    //     appearance="ghost"
    //     icon={<Icon svg name={icon} size={size} color={color} />}
    //     circle
    //   />
    // </Whisper>
  );
};

export default CustomDropdown;
