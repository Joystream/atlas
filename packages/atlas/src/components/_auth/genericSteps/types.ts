type LoadingSetter = (value: boolean) => void
export type SetActionButtonHandler = (setLoading?: LoadingSetter) => void | Promise<void>
export type SetActionButtonHandlerSetter = (fn: SetActionButtonHandler) => void
