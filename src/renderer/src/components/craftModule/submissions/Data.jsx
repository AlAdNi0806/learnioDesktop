// import {
//     ArrowDownIcon,
//     ArrowRightIcon,
//     ArrowUpIcon,
//     CheckCircledIcon,
//     CircleIcon,
//     CrossCircledIcon,
//     QuestionMarkCircledIcon,
//     StopwatchIcon,
// } from "@radix-ui/react-icons"
import { ArrowDown, CircleCheck } from "lucide-react"

export const labels = [
    {
        value: "bug",
        label: "Bug",
    },
    {
        value: "feature",
        label: "Feature",
    },
    {
        value: "documentation",
        label: "Documentation",
    },
]

export const statuses = [
    {
        value: "backlog",
        label: "Backlog",
        icon: ArrowDown,
    },
    {
        value: "todo",
        label: "Todo",
        icon: CircleCheck,
    },
    {
        value: "in progress",
        label: "In Progress",
        icon: ArrowDown,
    },
    {
        value: "done",
        label: "Done",
        icon: ArrowDown,
    },
    {
        value: "canceled",
        label: "Canceled",
        icon: ArrowDown,
    },
]

export const priorities = [
    {
        label: "Low",
        value: "low",
        icon: ArrowDown,
    },
    {
        label: "Medium",
        value: "medium",
        icon: ArrowDown,
    },
    {
        label: "High",
        value: "high",
        icon: ArrowDown,
    },
]