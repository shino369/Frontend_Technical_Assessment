import { Doctor } from "models/Doctor";
import React, { useCallback, useEffect, useState } from "react";
import { getDoctor, getDoctorList } from "services/DoctorService";
import "./index.scss";
import { useMediaQuery } from "react-responsive";
import { Paper } from "@mui/material";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { setLoading } from "store/loading";
import { useLocation } from "react-router-dom";
import { Booking, WEEK, WEEKDAYS, WEEKMAPPER } from "models/Booking";
import { getBookingList, patchBooking } from "services/bookingService";
import { Table, Button, DatePicker } from "rsuite";
import moment from "moment";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ConfirmDialog } from "components";

const FORM_MAX_WIDTH = "1280px";

const schema = yup.object({
  id: yup.string().required(),
  date: yup.date().required(),
  start: yup.date().required(),
});

interface TableData extends Booking {
  doctor: string;
  location: string;
  action: string | null;
}

export const RecordPage = () => {
  const isMobile = useMediaQuery({ query: `(max-width: 576px)` });
  const dispatch = useDispatch();
  const [record, setRecord] = useState<TableData[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [sortColumn, setSortColumn] = useState<string>();
  const [sortType, setSortType] = useState<any>();
  const editable = new Map([
    ["start", true],
    ["date", true],
  ]);
  const [activeTable, setActiveTable] = useState<TableData | undefined>();
  const { control, formState, handleSubmit, getValues, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  const getRecord = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const bookingList = await getBookingList();
      const doctorList = await getDoctorList();
      const _bookingList = bookingList.map((booking) => {
        const doctor = doctorList.find(
          (doctor) => doctor.id === booking.doctorId
        );
        return {
          ...booking,
          start: `${booking.start}:00`,
          doctor: doctor!.name,
          location: `${doctor?.address.line_2}, ${doctor?.address.line_1}, ${doctor?.address.district} `,
          action: null,
        };
      });

      const __bookingList = _.orderBy(
        _bookingList,
        ["date", "start"],
        ["desc", "desc"]
      );

      const _doctorList = doctorList.map((item) => ({
        ...item,
        notAvailableDays: item.opening_hours
          .filter((_item) => _item.isClosed)
          .map((__item) => WEEKDAYS[__item.day]),
        reformatted_op_hours: Object.assign(
          {},
          ...item.opening_hours.map((_item) => ({
            [WEEKMAPPER[_item.day]]: { start: _item.start, end: _item.end },
          }))
        ),
      }));

      setRecord(__bookingList);
      setAllDoctors(_doctorList);
      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
    }
  }, []);

  useEffect(() => {
    getRecord();
  }, []);

  const handleSort = useCallback((sortColumn: string, sortType?: 'asc' | 'desc') => {
    setSortColumn(sortColumn);
    setSortType(sortType);
    console.log(sortColumn, sortType);
    const sortRecord = _.orderBy(
      record,
      [sortColumn],
      [sortType || "asc"]
    );
    setRecord(sortRecord);

  }, []);

  const handleEditState = (rowData: TableData, cancel?: boolean) => {
    let nextData: TableData[] = Object.assign([], record);

    if (rowData.id) {
      if (cancel) {
        const ativeRow = nextData.find((item) => item.id === rowData.id);
        if (ativeRow) {
          ativeRow.action = null;
          setRecord(nextData);
        }
      } else {
        nextData = nextData.map((item) => ({
          ...item,
          action: item.id === rowData.id ? "EDIT" : null,
        }));
        setValue("id", rowData.id);
        setValue("date", moment(rowData.date).toDate());
        setValue("start", moment(rowData.start, "HH:mm:ss").toDate());
        setRecord(nextData);
      }
    }
  };

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      dispatch(setLoading(true));
      const res = await patchBooking(data.id, {
        date: moment(data.date).format("YYYY-MM-DD"),
        start: parseInt(moment(data.start).format("HH:mm").split(":")[0]),
        status: "confirmed",
      });

      setRecord((old) =>
        old.map((item) => ({
          ...item,
          action: null,
        }))
      );

      dispatch(setLoading(false));
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
    }
  };

  const onCancel = async () => {
    if (activeTable) {
      try {
        const res = await patchBooking(activeTable.id, {
          status: "cancelled",
        });
        getRecord();
      } catch (error) {
        console.log(error);
        dispatch(setLoading(false));
      }
    }
  };

  const isValidRange = (date: Date, doctor: Doctor) => {
    const availableRange = doctor.reformatted_op_hours;
    const weekday = moment(getValues("date")).weekday();
    const hour = moment(date);

    if (availableRange && availableRange[weekday]) {
      const start = moment(availableRange[weekday]?.start, "H.mm");
      const end = moment(availableRange[weekday]?.end, "H.mm");
      if (hour.isAfter(start) && hour.isBefore(end)) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  const isValidHour = (hour: number, doctor: Doctor) => {
    const availableRange = doctor.reformatted_op_hours;
    const weekday = moment(getValues("start")).weekday();
    const _hour = moment(`${hour}:00`, "H:mm");

    if (availableRange && availableRange[weekday]) {
      const start = moment(availableRange[weekday]?.start, "H.mm");
      const end = moment(availableRange[weekday]?.end, "H.mm");
      if (_hour.isAfter(start) && _hour.isBefore(end)) {
        return false;
      }
    }
    return true;
  };

  const notAvailable = (date: Date | undefined, doctor: Doctor) => {
    // console.log(moment(date).weekday());
    if (moment(date).isBefore(new Date())) {
      return true;
    }
    // doc!.notAvailableDays = [1,2,3]    // check if work by test data
    if (doctor && doctor.notAvailableDays) {
      if (doctor.notAvailableDays.length === 0) {
        return false;
      } else {
        return doctor.notAvailableDays.includes(moment(date).weekday());
      }
    }
    return false;
  };

  const EditCell = (props: any) => {
    const { rowData, dataKey } = props;
    const editing = rowData.action === "EDIT";
    const doc = allDoctors.find((doctor) => doctor.id === rowData.doctorId);

    return (
      <Table.Cell {...props} className={editing ? "table-content-editing" : ""}>
        {editing && editable.get(dataKey) && dataKey === "date" ? (
          <Controller
            control={control}
            name="date"
            render={({ field: { onChange, value, name } }) => (
              <DatePicker
                value={value}
                placeholder={"please select a date"}
                placement="auto"
                name={name}
                cleanable={false}
                onChange={(date) => {
                  if (date) {
                    onChange(date);
                  }
                }}
                disabledDate={(date) => notAvailable(date, doc!)}
                style={{ width: "100%" }}
              />
            )}
          />
        ) : editing && editable.get(dataKey) && dataKey === "start" ? (
          <Controller
            control={control}
            name="start"
            render={({ field: { onChange, value, name } }) => (
              <DatePicker
                placeholder={"please select a time"}
                value={value}
                placement="auto"
                disabled={!getValues("date")}
                cleanable={false}
                name={name}
                onChange={(date) => {
                  if (date && isValidRange(date, doc!)) {
                    onChange(date);
                  }
                }}
                format="HH:mm"
                ranges={[]}
                hideHours={(hour) => isValidHour(hour, doc!)}
                hideMinutes={(minute) => {
                  return minute % 60 !== 0;
                }}
                style={{ width: "100%" }}
              />
            )}
          />
        ) : (
          <span
            className={`${
              dataKey === "status"
                ? rowData[dataKey] === "confirmed"
                  ? "badge rounded-pill bg-secondary"
                  : "badge rounded-pill bg-dark"
                : ""
            } table-content-edit-span`}
          >
            {rowData[dataKey]}
          </span>
        )}
      </Table.Cell>
    );
  };

  const ActionCell = (props: any) => {
    const { rowData, onClick } = props;
    return (
      <Table.Cell {...props} style={{ padding: "6px" }}>
        {/* <Button
          appearance="link"
          onClick={
            rowData.action === "EDIT"
              ? handleSubmit(onSubmit)
              : ()=>{handleEditState(rowData)} 
          }
        >
          {rowData.action === "EDIT" ? "Save" : "Edit Time"}
        </Button> */}
        {rowData.status === "confirmed" && (
          <Button
            appearance="link"
            onClick={() => {
              setActiveTable(rowData);
            }}
          >
            Cancel
          </Button>
        )}
        {rowData.action === "EDIT" && (
          <Button
            appearance="link"
            onClick={() => {
              handleEditState(rowData, true);
            }}
          >
            Cancel
          </Button>
        )}
      </Table.Cell>
    );
  };

  return (
    <div className="p-4 d-flex justify-content-center">
      <Paper
        elevation={isMobile ? 0 : 3}
        sx={{
          width: "100%",
          maxWidth: FORM_MAX_WIDTH,
          // maxHeight: FORM_MAX_HEIGHT,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          className={`page-header mb-2 ${
            isMobile ? "px-0" : "px-4 py-4 bg-secondary"
          }`}
        >
          <strong>Booking Record</strong>
        </div>

        <div className="d-flex flex-column flex-grow-1">
          <Table
            height={420}
            data={record}
            wordWrap
            sortColumn={sortColumn}
            sortType={sortType}
            onSortColumn={(sortColumn, sortType) => {
              handleSort(sortColumn, sortType);
            }}
          >
            <Table.Column flexGrow={1} sortable>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <EditCell dataKey="date" />
            </Table.Column>

            <Table.Column flexGrow={1} sortable>
              <Table.HeaderCell>Time</Table.HeaderCell>
              <EditCell dataKey="start" />
            </Table.Column>

            <Table.Column flexGrow={1} sortable>
              <Table.HeaderCell>Doctor</Table.HeaderCell>
              <EditCell dataKey="doctor" />
            </Table.Column>

            <Table.Column flexGrow={2} sortable>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <EditCell dataKey="location" />
            </Table.Column>

            <Table.Column flexGrow={1} sortable>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <EditCell dataKey="status" />
            </Table.Column>

            <Table.Column flexGrow={1}>
              <Table.HeaderCell>Action</Table.HeaderCell>
              <ActionCell dataKey="id" />
            </Table.Column>
          </Table>
        </div>
      </Paper>

      <ConfirmDialog
        open={activeTable !== undefined}
        title={"Cancel booking?"}
        message={`Are you sure you want to cancel the the following booking ?`}
        highlight={[
          { key: "date", value: activeTable?.date || "" },
          { key: "start", value: activeTable?.start || "" },
          { key: "doctor", value: activeTable?.doctor || "" },
        ]}
        onConfirm={() => {
          setActiveTable(undefined);
          onCancel();
        }}
        onCancel={() => {
          setActiveTable(undefined);
        }}
      />
    </div>
  );
};
