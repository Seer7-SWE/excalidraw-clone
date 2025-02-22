import { DrawnElementType, Position, Coordinates } from "@/types";

export type State = {
    elements: DrawnElementType[];
    selectedElementId: number | null;
    scale: number;
    panOffset: Coordinates;
    isWriting: boolean;
    textareaPosition: Coordinates;
    resizing: {
        isResizing: boolean;
        corner: Position | null;
    };
};

type CanvasAction =
    | { type: "ADD_ELEMENT"; element: DrawnElementType }
    | { type: "UPDATE_ELEMENT"; id: number; updates: Partial<DrawnElementType> }
    | { type: "SELECT_ELEMENT"; id: number | null }
    | { type: "SET_SCALE"; scale: number }
    | { type: "SET_PAN_OFFSET"; offset: Coordinates }
    | { type: "START_RESIZE"; corner: Position }
    | { type: "STOP_RESIZE" }
    | { type: "START_TEXT_EDIT"; position: Coordinates }
    | { type: "STOP_TEXT_EDIT" };

export const canvasReducer = (state: State, action: CanvasAction): State => {
    switch (action.type) {
        case "ADD_ELEMENT":
            return {
                ...state,
                elements: [...state.elements, action.element],
            };

        case "UPDATE_ELEMENT":
            return {
                ...state,
                elements: state.elements.map((el) =>
                    el.id === action.id ? { ...el, ...action.updates } : el
                ),
            };

        case "SELECT_ELEMENT":
            return { ...state, selectedElementId: action.id };

        case "SET_SCALE":
            return { ...state, scale: action.scale };

        case "SET_PAN_OFFSET":
            return { ...state, panOffset: action.offset };

        case "START_RESIZE":
            return { ...state, resizing: { isResizing: true, corner: action.corner } };

        case "STOP_RESIZE":
            return { ...state, resizing: { isResizing: false, corner: null } };

        case "START_TEXT_EDIT":
            return { ...state, isWriting: true, textareaPosition: action.position };

        case "STOP_TEXT_EDIT":
            return { ...state, isWriting: false, textareaPosition: { x: 0, y: 0 } };

        default:
            return state;
    }
};
