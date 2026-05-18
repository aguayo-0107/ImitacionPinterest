const llave_acceso = 'by3aSUHls8PSV2olnAAZtqF3WQMdFZvKqPtC5yHULcM';
const fotos_por_pag = 15
const order_by = 'latest';
const url = `https://api.unsplash.com/photos?per_page=${fotos_por_pag}&order_by=${order_by}`;

async function pins_descubrir() {
    try{
        pins = [];
        unsplash = await fetch(
            url,
            {headers:
            {
                'Authorization': `Client-ID ${llave_acceso}`
            }
            });
    }
    catch(error){
        console.log(error);
    }
}