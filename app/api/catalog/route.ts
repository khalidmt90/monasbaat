import { NextResponse } from "next/server";
import { loadCatalog } from "@/lib/catalog";

export async function GET(){
  try {
    const data = await loadCatalog();
    return NextResponse.json(data,{ headers:{"Cache-Control":"public, max-age=60"}});
  } catch (e){
    return NextResponse.json({ error:"catalog_unavailable"},{ status:503 });
  }
}
