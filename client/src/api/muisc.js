import req from "@/fetch"

export const getDir = () => req.get("getDir")

export const getFile = (path) => req.get("getFile", { path })