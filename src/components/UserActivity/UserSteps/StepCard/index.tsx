import { Card, CardContent, Chip, Stack, Tooltip, Typography } from "@mui/material";
import { IDict, IDictWithColor, IUserStep } from "../../types";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import CommitOutlinedIcon from "@mui/icons-material/CommitOutlined";
import humanizeDuration from "humanize-duration";
import React from "react";

interface StepCardProps {
  userStep: IUserStep;
  typeLifeColor: string;
  onClickTypeLife: (typeLife: IDictWithColor) => void;
  onClickTask: (task: IDict) => void;
}

const formatStartFinishTimes = (userStep: IUserStep): string => {
  const startTime = userStep.start?.split("+")[0]?.split(" ")[1]?.slice(0, 5);
  const durationInSeconds = Number(userStep.value);
  const finishTime = new Date(new Date(userStep.start).getTime() + durationInSeconds * 1000)
    .toISOString()
    .split("T")[1]
    .split(".")[0]
    .slice(0, 5);
  return `${startTime} - ${finishTime}`;
};

const StepCard = ({ userStep, typeLifeColor, onClickTypeLife, onClickTask }: StepCardProps) => {
  console.log("StepCard enter");
  const startFinishTimes = formatStartFinishTimes(userStep);
  const tooltipTitle = userStep.mainevent ? "This step is Main event" : "";

  return (
    <Card
      variant="outlined"
      sx={{
        marginLeft: "6px",
        border: "none",
        // borderLeft: "1px solid gray",
        // borderRadius: "12px",
        backgroundColor: "transparent"
      }}
    >
      <CardContent
        sx={{
          paddingTop: "6px",
          "&.MuiCardContent-root:last-child": { paddingBottom: "6px" }
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "center"
          }}
        >
          <Tooltip title={tooltipTitle}>
            <CommitOutlinedIcon
              fontSize="large"
              sx={{
                transform: "scale(1.5) rotate(90deg)",
                fill: userStep.mainevent ? "red" : "gray"
              }}
            />
          </Tooltip>
          <Stack direction="column">
            <Stack direction="row" spacing={1}>
              <Chip
                size="small"
                label={userStep.typelife}
                sx={{
                  bgcolor: typeLifeColor,
                  color: "black",
                  "&:hover": {
                    backgroundColor: typeLifeColor // Prevent background color change
                  }
                }}
                onClick={() =>
                  onClickTypeLife({
                    id: userStep.typelifeid,
                    name: userStep.typelife,
                    color: typeLifeColor
                  })
                }
              />
              <Chip
                size="small"
                label={userStep.task}
                color="primary"
                variant="outlined"
                onClick={() => onClickTask({ id: userStep.taskid, name: userStep.task })}
              />
              <Chip
                size="small"
                icon={<TimerOutlinedIcon />}
                label={
                  userStep?.value !== undefined
                    ? humanizeDuration(Number(userStep.value) * 1000, {
                        language: "ru",
                        units: ["d", "h", "m"],
                        round: true
                      }) +
                      " (" +
                      startFinishTimes +
                      ")"
                    : "Invalid value"
                }
              />
            </Stack>
            <Typography variant="h6">{userStep.step || "empty step"}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const StepCardMemo = React.memo(StepCard);
export default StepCardMemo;
