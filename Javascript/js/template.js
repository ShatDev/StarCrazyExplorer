templates = 
{
    "totalDigP" : `<h1 class='text-center mt-5'>Total Digging Power: <%= totalDigp  %> </h2>`,
    "starz": `<% nfts.forEach(function(nft){ %>
        <div class="nft col-md-3">
            <div class="frame " style=" <%= 'background-image: url(' + nft.nft_frame + ')'%>">
                <div class="cat_body">
                    <div class="parts">
                        <img class="beard" src="<%=  nft.nft_style[0]  %> ">
                        <img class="ear" src="<%=  nft.nft_style[1]  %> ">
                        <img class="eye" src="<%=  nft.nft_style[2]  %> ">
                        <img class="head" src="<%=  nft.nft_style[3]  %> ">
                        <img class="mouth" src="<%=  nft.nft_style[4]  %> ">
                        <img class="skin" src="<%=  nft.nft_style[5]  %> ">
                        <img class="tail" src="<%=  nft.nft_style[6]  %> ">
                        <img class="tattoo" src="<%=  nft.nft_style[7]  %> ">                             
                    </div>
                </div>
                
                <div class="qlty">
                    <div class="dots">
                        <img class="d1" src="<%= 'cat/quality/' +  nft.nft_qlty[0] + '.png' %> ">
                        <img class="d2" src="<%= 'cat/quality/' +  nft.nft_qlty[1] + '.png' %> ">
                        <img class="d3" src="<%= 'cat/quality/' +  nft.nft_qlty[2] + '.png' %> ">
                        <img class="d4" src="<%= 'cat/quality/' +  nft.nft_qlty[3] + '.png' %> ">
                        <img class="d5" src="<%= 'cat/quality/' +  nft.nft_qlty[4] + '.png' %> ">
                        <img class="d6" src="<%= 'cat/quality/' +  nft.nft_qlty[5] + '.png' %> ">
                        <img class="d7" src="<%= 'cat/quality/' +  nft.nft_qlty[6] + '.png' %> ">
                        <img class="d8" src="<%= 'cat/quality/' +  nft.nft_qlty[7] + '.png' %> ">                              
                    
                    </div>
                    <div class="nft_id">#<%= nft.nft_id %> </div>
                </div>
            </div>
            <div class="nft_digp">
                <span>DigP: <%= nft.nft_digp %></span>
            </div>
        </div>
    <% }); %>`

}