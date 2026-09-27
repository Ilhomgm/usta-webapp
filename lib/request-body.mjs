// Bound streaming bodies too; Content-Length is not a reliable size limit.
export async function boundedBody(request,maximum){
 const reader=request.body?.getReader();if(!reader)return new Uint8Array();
 const chunks=[];let size=0;
 try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;
  if(size>maximum){await reader.cancel();const error=new Error('Слишком большой запрос');error.status=413;throw error}chunks.push(value);
 }}finally{reader.releaseLock()}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length}return bytes;
}
