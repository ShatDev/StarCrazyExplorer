(function () {
    $(function () {

        var provider = null;                
        const _useMainNet = true;
        const catAddress = "io1asxdtswkr9p6r9du57ecrhrql865tf2qxue6hw";
        const mineAddress = "io1mt5u8vzxzuwq7hut99t9tvduhykzgkfclwlsgj";
        const abi = CatABI;
        const bodyInfo = CatBodyInfo;
        const template = templates;
        const defaultContractOptions = {
            gasLimit: "10000000",
            gasPrice: "1000000000000"
        };

        const starCrazyAPIEndPoint = "https://game.starcrazy.com/api/prod/graphql";
       
        
        const convertToArray = function (BigNumberArray) {           
            var res = [];
            BigNumberArray.forEach(function (v) {                
                var bg =  new BigNumber(v);
                res.push(bg.toFixed());
            });
            
            return res;
        };

        const sendGetRequest = async () => {

            var model = []
            var accountAddress = $("#address").val();
            
            var antenna = null;
            var contract = null;

            if (provider == null) {               
                antenna = new Antenna(_useMainNet ? "https://api.iotex.one" : "https://api.testnet.iotex.one");
                provider = antenna.iotx;
            }

            var contract = new Antenna.modules.Contract(abi, catAddress, {
                provider: provider,
                signer: null
            });

            var MiningContract = new Antenna.modules.Contract(abi, mineAddress, {
                provider: provider,
                signer: null
            });
            
            var NftsOfOwner = convertToArray(await  contract.methods.tokensOfOwner(accountAddress, {
                account: null,
                defaultContractOptions
            }));

            var NftsOfOwnerMining = convertToArray(await MiningContract.methods.depositedTokens(accountAddress, {
                account: null,
                defaultContractOptions
            }));
          

            await asyncForEach(NftsOfOwnerMining.concat(NftsOfOwner), async (nft) => {
                
               
                var cat = await GetAlianaByIdUsingGraphQl(nft);
                var qlty = await geneToQlty(cat.data.aliana.genes);             
                var style = await geneToStyle(cat.data.aliana.genes);              

                /*
                old style of calling aliana data 
                var cat = await viewCat(contract, nft); 
                var qlty = await geneToQlty(cat['3']);
                var style = await geneToStyle(cat['3']);

                model.push(
                    {
                        //nft_cat: cat,            
                        nft_id: nft,
                        nft_digp: (new BigNumber(cat['4'])).toFixed(),
                        nft_style: (await getCatDataByStyle(style)),
                        nft_qlty: qlty,
                        nft_frame: (await getFrame(qlty, cat['4']))
                    }
                );
                */

                model.push(
                    {
                        //nft_cat: cat,            
                        nft_id: nft,
                        nft_digp: cat.data.aliana.lpLabor,
                        nft_style: (await getCatDataByStyle(style)),
                        nft_qlty: qlty,
                        nft_frame: (await getFrame(qlty, cat.data.aliana.lpLabor)),
                        nft_elementType: (await getElementView(cat.data.aliana.elementType,cat.data.aliana.bornFightBuff)),
                        nft_baseFightAttr: cat.data.aliana.baseFightAttr,
                        nft_bornFightBuff: cat.data.aliana.bornFightBuff
                    }
                );
                
            });
          
            return model;
        };

       
        
        async function asyncForEach(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        }      

        const getTotalDigP = async (nfts) => {

            var total = 0;           

            nfts.forEach(function (v) {
                total += parseInt(v.nft_digp);
            });

            return total;

        };

        const getElementView = async(type, bornFightBuff) => {

            var element = {
                image: "",
                type: ""
            };

            if (bornFightBuff != null) type = 0; // set to zero so that it will trigger default image for buff nft

            switch(type) {
                case 1:
                    element.image = "StarArena_023";
                    element.type = "Fire"
                    break;
                case 2:
                    element.image = "StarArena_020";
                    element.type = "Rock" 
                    break;
                case 3:
                    element.image = "StarArena_021";
                    element.type = "Grass"
                    break;
                case 4:
                    element.image = "StarArena_022";
                    element.type = "Water"
                    break;  
                case 5:
                    element.image = "StarArena_019";
                    element.type = "Poison"
                    break; 
                default:   
                    element.image = "StarArena_60";
                    element.type = "Buff"                
            }

            return element;
        }

        const generateRequestBody = async (nftId) => {
            var jasonBody = {
                "operationName": "getAlianaByCatId",
                "query": "query getAlianaByCatId($catId: Int!) { aliana(id: $catId) {   id   sireID   matronID   birthTime   genes   isCollections   baseFightAttr {     hp     atk     spd     chr     br     actionPoint     battlePower   }   lpLabor   elementType   bornFightBuff {     id     type     effectStr     effect {       millionthRatioValue       fixedValue       target       valueFromAttr       valueToAttr     }   } }}",
                "variables": {"catId": nftId},
                "catId": nftId
            }    
            return jasonBody;
        };

        const GetAlianaByIdUsingGraphQl = async (catId) => {            
            var nftid = new BigNumber(catId);         
            const response = await fetch(starCrazyAPIEndPoint, {
                    method: 'POST',
                    headers: {                   
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(await generateRequestBody(nftid.toNumber()))
                });
                return response.json(); 
        };

        const viewCat = async (contract, catId) => {
            var nftid = new BigNumber(catId);
            var catDetails = await contract.methods.getAliana(nftid.toString(),
                {
                    account: null,
                    defaultContractOptions
                });
            return catDetails;
        }

        const geneToStyle = async (geneId) => {
            var res = [];
            var gene = new BigNumber(geneId);

            for (let i = 0; i < 8; i++) {
                gene = gene.dividedToIntegerBy(256);
                res[i] = gene.mod(256).toNumber();
                gene = gene.dividedToIntegerBy(256);
            }

            return res;
        }

        const geneToQlty = async (geneId) => {
            var gene = new BigNumber(geneId);
            var res = [];
            for (let i = 0; i < 8; i++) {
                res[i] = gene.mod(65536).mod(256).toNumber();
                gene = gene.dividedToIntegerBy(65536);
            }
            return res;

        }

        const getFrame = async (qualities, digp) => {

            if (digp <= 0) return "cat/frame/special_01.png" // special frame

            /*
            0 < N < 50
            50 < R < 120
            120 < SR < 240
            240 < SSR < 500
            500 < UR < 9999999
            */
            var sum = 0;

            qualities.forEach(function (v) {
                if (v == 0) sum += 2; // N dot
                if (v == 1) sum += 10; // R dot
                if (v == 2) sum += 20; // SR dot
                if (v == 3) sum += 40; // SSR dot
                if (v == 4) sum += 100; // UR dot
                /* Sample
                    UR 100
                    UR 100
                    SR 20
                    UR 100
                    UR 100
                    SR 20
                    SR 20
                    SSR 40
                    Tota = 500*/
            });
            // cat/frame/synthesis_03.png
            if (sum >= 0 && sum <= 50) return "cat/frame/synthesis_06.png"  // normal
            if (sum > 50 && sum <= 120) return "cat/frame/synthesis_05.png" // rare
            if (sum > 120 && sum <= 240) return "cat/frame/synthesis_07.png" // SR
            if (sum > 240 && sum <= 500) return "cat/frame/synthesis_03.png" // SSR
            if (sum > 500 && sum < 999999999) return "cat/frame/synthesis_04.png" // UR

        }

        const getCatDataByStyle = async (style) => {

            var res = [];

            style.forEach(function (v, i) {

                var id = 1000 * (i + 1) + v + 1;
                var catData = bodyInfo[id];

                if (catData != null) {
                    //res.push(    catData.Pic + '.png' + "   index=" + i + "   style=" + v + "     id="+ id);
                    res.push(catData.Pic + '.png');
                } else {
                    res.push('');
                }

            })
            return res;
        }

        const RenderTotalDigP = function(data) {             
            var html = ejs.render(
                template.totalDigP
                , {totalDigp: data});
            $('.totalDigP_Wrapper').html(html);

        };

        const RenderStarz = function (model) {                     
            var html = ejs.render(
                template.starz
                , model);
            $('.nft_wrapper').html(html);
        };

        $(".btn-primary").on('click',async function(){

            var accountAddress = $("#address").val();

            if (accountAddress.trim() == '') {
                $("#address").notify(
                    "Input iotex address!", 
                    { position:"bottom" }
                );
                return false;
            }

            $.LoadingOverlay("show");

            var model = {
                address: $("#address").val(),
                nfts: [],
                totalDigP: 0
            };

            try {
                model.nfts = await sendGetRequest();
                model.totalDigP = await getTotalDigP(model.nfts);
                RenderTotalDigP(model.totalDigP);
                RenderStarz(model); 
            }
            catch(err) {
                $.LoadingOverlay("hide");
                $.notify("Error getting nfs!", "error");
            } 
            $.LoadingOverlay("hide");
        })

    }

    );
})();