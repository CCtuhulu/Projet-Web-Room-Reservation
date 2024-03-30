import moment from "moment";
import Calendar from "../Calendar";
import "./index.css"

const events = [
  {
    start: moment("2024-03-29T10:00:00").toDate(),
    end: moment("2024-03-29T11:00:00").toDate(),
    title: "Salle 01",
    data: {
      type: "TP",
    },
  },
  {
    start: moment("2024-03-29T14:00:00").toDate(),
    end: moment("2024-03-29T15:30:00").toDate(),
    title: "Salle 02",
    data: {
      type: "TD",
    },
  },
];

const components = {
  event: (props: any) => {
    const eventType = props?.event?.data?.type;
    switch (eventType) {
      case "TP":
        return (
          <div style={{ background: "yellow", color: "white", height: "100%" }}>
            {props.title}
          </div>
        );
      case "TD":
        return (
          <div
            style={{ background: "lightgreen", color: "white", height: "100%" }}
          >
            {props.title}
          </div>  
        );
      default:
        return null;
    }
  },
};

export default function ControlCalendar() {
  return <Calendar events={events} components={components} />;
}
