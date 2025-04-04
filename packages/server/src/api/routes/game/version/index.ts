import { Hono } from "hono";
import { cache } from "../../../middleware/cache";
import { isFlashRequest } from "../../../../utils/flash-request";

const vars = {
	sBG: "Generic2.swf",
	sFile: "Game3089.swf",
	sLoader: "Loader.swf",
	sTitle: "Fresh Start!",
	sVersion: "0.1",
	sCharSelect: "interface/CharSelect/charselect.swf",
	sBGM: "https://cdn.discordapp.com/attachments/1265308711237455905/1356642458980585482/kathleen-lumini.mp3?ex=67ed4f3f&is=67ebfdbf&hm=8533dacd758309f39d12df9b26e3920fc53c0a08c10661261863afb1b0555975&",
};

const app = new Hono();

app.use(cache({ maxAge: "1day" }), async (c, next) => {
  if (c.req.method !== "GET") {
    await next();
    return;
  }

  return c.json(vars);
})

export default app;
