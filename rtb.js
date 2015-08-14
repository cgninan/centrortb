function User(userid,name,accountBal) {
    this.userid = userid;
    this.name = name;
    this.accountBal = accountBal;
    
}

function Campaign(campaignID,name,startDate,endDate,budget,adimageURL,userid) {
    this.campaignID = campaignID;
    this.name = name;
    this.start = startDate;
    this.end = endDate;
    this.budget = budget;
    this.adimageURL = adimageURL; 
    this.userid = userid;
}


function CampaignStats(campaignID,noOfBids,noOfWon,noOfClicks) {
    this.campaignID = campaignID;
    this.noOfBids = noOfBids; 
    this.noOfWon = noOfWon;
    this.noOfClicks = noOfClicks; 
}


function init() {
 
    var user = new User('RTB-USER','fname lname',50000);
    localStorage.setItem('user',JSON.stringify(user));
    var campaigns = new Array();
    var i = 0;
    var dt = new Date();
    campaigns.push(new Campaign(++i,'campaign'+i,getDateString(dt),getDateString(dt),Math.ceil(Math.random() * 10000),'/url'+i,'RTB-USER'));
    campaigns.push(new Campaign(++i,'campaign'+i,getDateString(dt),getDateString(dt),Math.ceil(Math.random() * 10000),'/url'+i,'RTB-USER'));
    localStorage.setItem('campaigns',JSON.stringify(campaigns));
    
    generateCampaignStats(campaigns);
    
    $('#userlabel').html(user.userid);
    hideCampaingSections();
    console.log('Logged in user: ' + user.userid);
    showCampaignStats();
    
}

function getDateString(dt) {
    var datestring = dt.toISOString().substring(0,10);
    var dateArray = datestring.split('-');
    return dateArray[1]+'/'+dateArray[2]+'/'+dateArray[0];
}

function generateCampaignStats(campaigns) {
    var campaignstats = new Array();
    for(i=0;i<campaigns.length;i++) {
    campaignstats.push(new CampaignStats(campaigns[i].campaignID,Math.ceil(Math.random() * 10),
                                         Math.floor(Math.random() * 10),Math.ceil(Math.random() * 100)));
    }
    localStorage.setItem('campaignstats',JSON.stringify(campaignstats));
}

function hideCampaingSections() {
    $('.camprow').hide();
}
function showCampaigns() {
   hideCampaingSections(); 
 $('#listcampaigns').show();
    $('#listcampaignstable > tbody').empty();
    var campaigns = JSON.parse(localStorage.getItem('campaigns'));
    for(i=0;i<campaigns.length;i++) {
        $('#listcampaignstable > tbody').append('<tr><td>'+campaigns[i].campaignID+'</td><td>'+campaigns[i].name+'</td><td>'+campaigns[i].start+'</td><td>'+campaigns[i].end+'</td><td>'+campaigns[i].budget+'</td><td>'+campaigns[i].adimageURL+'</td><td><button type="button" class="btn btn-xs" onclick="editCampaign('+campaigns[i].campaignID+')"><span class="glyphicon glyphicon-edit"></span></button></td></tr>');
        
    }
    console.log('GET /centro/rtb/campaigns/RTB-USER');
}
function showCampaignStats() {
    hideCampaingSections();
    $('#campaignstats').show();
    
    $('#campaignstatstable > tbody').empty();
    var campaigns = JSON.parse(localStorage.getItem('campaigns'));
    var campaignstats = JSON.parse(localStorage.getItem('campaignstats'));
    for(i=0;i<campaignstats.length;i++) {
        if(new Date() > new Date(campaigns[i].start)) {
            
        $('#campaignstatstable > tbody').append('<tr><td>'+campaignstats[i].campaignID+'</td><td>'+campaignstats[i].noOfBids+'</td><td>'+campaignstats[i].noOfWon+'</td><td>'+campaignstats[i].noOfClicks+'</td></tr>');
        } else {
            $('#campaignstatstable > tbody').append('<tr><td>'+campaignstats[i].campaignID+'</td><td>NA - future ad</td><td>NA - future ad</td><td>NA - future ad</td></tr>');
        }
    }
    
    console.log('GET /centro/rtb/campaignstats/RTB-USER');
}

function createCampaign() {
    hideCampaingSections();
    $('#newcampaignform').show();
    $('#campformlabel').html('Create new campaign form');
    $('#campformerror').hide();
    $('#updatebutton').hide();
    $('#newcampaignform input').val('');
    $('#campuser').val(JSON.parse(localStorage.getItem('user')).userid);
}

function editCampaign(campaignID) {
    hideCampaingSections();
     $('#editcampaignform').show();
    $('#newcampaignform').show();
    $('#updatebutton').show();
    $('#campformlabel').html('Update campaign form');
    var campaigns = JSON.parse(localStorage.getItem('campaigns'));
    $('#campaignselect').empty();
     $('#campaignselect').append('<option>Please select a campaign</option>');
    var selectedCampaign;
    for(i=0;i<campaigns.length;i++) {
        if(campaigns[i].campaignID === campaignID) {
            selectedCampaign = campaigns[i];
            $('#campaignselect').append('<option value="'+campaigns[i].campaignID +'" selected>'+campaigns[i].name+'</option>');
        } else {
         $('#campaignselect').append('<option value="'+campaigns[i].campaignID +'">'+campaigns[i].name+'</option>');   
        }
        
    }
    
    
    $('#campformerror').hide();
    populateForm(selectedCampaign);
    $('#campuser').val(JSON.parse(localStorage.getItem('user')).userid);
}

function populateForm(selectedCampaign) {
 $('#campname').val(selectedCampaign.name);
    $('#campstart').val(selectedCampaign.start);
    $('#campend').val(selectedCampaign.end);
    $('#campbudget').val(selectedCampaign.budget);
    $('#campad').val(selectedCampaign.adimageURL);   
}

function editSelectedCampaign() {
    $('#newcampaignform input').val('');
    var selectedCampaign =  $('#campaignselect').val() * 1;
    var campaigns = JSON.parse(localStorage.getItem('campaigns'));
    selectedCampaign = campaigns[selectedCampaign - 1];
    populateForm(selectedCampaign);
}

function addCampaign(action) {
     
    $('#newcampaignform .has-error').removeClass('has-error');
    var error = false;
    var campaign = new Campaign();
    campaign.name = $.trim($('#campname').val());

    if(campaign.name.length == 0) {
       $('#campname').parent().addClass('has-error');
        error = true;
    }
    campaign.start = $.trim($('#campstart').val());
    if(!(isValidDate(campaign.start))) {
           $('#campstart').parent().addClass('has-error');
        error = true;
       }    
    campaign.end = $.trim($('#campend').val());
    if(!(isValidDate(campaign.end))) {
           $('#campend').parent().addClass('has-error');
        error = true;
       } 
    
    if(!error) {
        if(new Date(campaign.end) < new Date(campaign.start)) {
            $('#campend').parent().addClass('has-error');
        error = true;
        }
    }
    campaign.budget = $('#campbudget').val();
    if(!(isNumericAndGreaterThanZero(campaign.budget))) {
        $('#campbudget').parent().addClass('has-error');
        error = true;
    }
    campaign.adimageURL = $.trim($('#campad').val());
    if(campaign.adimageURL.length == 0) {
       $('#campad').parent().addClass('has-error');
        error = true;
   }
    
    if(error) {
        $('#campformerror').show();
        campaign = null;
    } else {
        $('#campformerror').hide();
        var campaigns = JSON.parse(localStorage.getItem('campaigns'));
        if(action === 'update') {
            
         var selectedCampaign =  $('#campaignselect').val() * 1;
            campaign.campaignID = selectedCampaign;
         campaigns[selectedCampaign - 1] = campaign;
        console.log('PUT /centro/rtb/campaigns/RTB-USER , ' + JSON.stringify(campaign));
        } else {
            campaign.userid = $.trim($('#campuser').val());
            campaign.campaignID = campaigns.length+1;
            campaigns.push(campaign);
            console.log('POST /centro/rtb/campaigns/RTB-USER , ' + JSON.stringify(campaign));
        }
            
        localStorage.setItem('campaigns',JSON.stringify(campaigns));
        generateCampaignStats(campaigns);
        showCampaigns();
    }
    
}

function isNumericAndGreaterThanZero(value) {
    if(!($.isNumeric(value))) {
        return false;
    }
    if((value * 1) <= 0) {
        return false;
    }
    return true;
}

function isValidDate(subject){
  if (subject.match(/^(?:(0[1-9]|1[012])[\- \/.](0[1-9]|[12][0-9]|3[01])[\- \/.](19|20)[0-9]{2})$/)){
    return true;
  }else{
    return false;
  }
}
