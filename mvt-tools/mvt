#!/bin/bash
# author		Lily Leguizamo
# email			lily.leguizamo@isobar.com


# TODO change testName to camelcase

echo_help (){
	echo "-------------------------------------------------------------"
	echo " Options"
	echo "-------------------------------------------------------------"
	echo "-h|--help		Generates help menu."
	echo "-j			Adds jQuery dependency check."
	echo "-l			Creates the long form template with Account, Portfolio, and Test Name."
	echo "(number)		Generates more than one template for each offer. Default is Control and one Offer."
	echo "(TestName) 	Names the folder and files. Defaults to Test."
	exit
}

# Set Variables
jq=false
chall=1
folderName='Test'
resFunnel=false

for arg in $*
do
a=$(echo "$arg" | tr '[:upper:]' '[:lower:]')
if [[ "${a}" == "--help" || "${a}" == "--h" ]]
then
	echo_help
elif [[ "${a}" == "-j" ]]
then
	jq=true
elif [[ "${a}" == "-r" ]]
then
	resFunnel=true
elif [[ "${a}" =~ ^[0-9]+$ ]]
	then
	chall=$a
else
	folderName=$arg
fi
done

if [[ -d $folderName ]]
	then
	echo -e "\033[0;91mERROR: Folder already exists\033[0m"
	exit
fi

echo "Test name?"
read testName
titleConcat=$(echo "$testName" | tr -d '[:space:]')

echo "Account Name?"
read account

echo "Portfolio?"
read portfolio

accountInfo="
		account : '$account',
		portfolio : '$portfolio',
		test : '$testName',"
satelliteFn="
			if (_satellite && typeof _satellite.setVar === 'function' && typeof _satellite.track === 'function') {
				_satellite.setVar('TargetCampaign', isoTest.test);
				_satellite.setVar('TargetCreative', isoTest.creative);
				_satellite.track('target_variables');
			}
"
accountLog="isoTest.log(isoTest.account + ' - ' + isoTest.portfolio);"


get_dependencies (){
	if [[ "${jq}" == true ]]
	then
		dependencies="dependsLoaded : function (callback) {
			isoTest.log(isoTest.test + ' - ' + isoTest.creative + ' - dependsLoaded - Start...');

			window.clearTimeout(isoTest.timer);
			//Check for jQuery
			if ((window.$ && $.isReady) || (window.jQuery && jQuery.isReady)) {
				if (typeof callback === 'function') {
					isoTest.log(isoTest.test + ' - ' + isoTest.creative + ' - dependsLoaded - Ready!');
					callback();
				}
			} else {
				isoTest.timer = window.setTimeout(function() {
					isoTest.dependsLoaded(callback);
				}, 100);
			}
		},"
	else
		dependencies=''
	fi
}

get_init (){
	init='isoTest.init();'
	if [[ "${jq}" == true ]]
	then
		init="isoTest.dependsLoaded(function(){
		isoTest.init();
	});"
	fi
}

get_resFunnel (){
	resListener=''
	resFunction=''
	if [[ "${resFunnel}" == true ]]
	then
		resListener='
		window.addEventListener('hashchange', isoTest.viewChange, false);
		'
		resFunction='
		hashHandler : function(){
			if(/viewName/.test(location.hash)){
				isoTest.elementLoaded(isoTest.selector, function() {
					isoTest.chall();
				});
			}
		},'
	fi
}

get_dependencies
get_init
get_resFunnel

generate_template () {

challName='Control'
creativeName='Control'

if [[ $1 -gt 0 ]]; then
	challName="Chall${1}"
	creativeName="Challenger $1"
fi

cat <<EOT >> ${folderName}/dev/${titleConcat}_${challName}.html
<style>
</style>
<script>
(function() {
	'use strict';
	var isoTest = {$accountInfo
		creative : '${creativeName}',
		selector: 'body',
		init : function() {

			isoTest.debug = \${user.mvtDebug};
			${satelliteFn}
			isoTest.log('Test Running...');
			${accountLog}
			isoTest.log(isoTest.test + ' - ' + isoTest.creative);

			helpers.elementLoaded(isoTest.selector, function() {
				isoTest.log('Test Ready!');
  				isoTest.chall();
			});
			${resListener}
		},${resFunction}
		chall : function() {

			// Your code goes here

		},
		fireTag : function(element, value) {
			var linkName = value ? value : element.innerText;
				linkName = isoTest.test ? isoTest.test + ' : ' + linkName : linkName;
			s.linkTrackVars = 'eVar20';
			s.eVar20 = linkName;
			s.tl(this, 'o', linkName);
		},$dependencies
		log : function(obj){
			if(isoTest.debug === true){
				console.log(obj);
			}
		}

	}

	var helpers = {
		elementLoaded : function (ele, callback) {
			isoTest.log('elementLoaded::  ' + ele + ' - Checking...');
			window.clearTimeout(isoTest.eleTimer);
			if (document.querySelectorAll(ele).length > 0) {
				if (typeof callback === 'function') {
					isoTest.log('elementLoaded::  ' + ele + ' - Found!');
					callback();
				}
	        } else {
	            isoTest.eleTimer = window.setTimeout(function(){isoTest.elementLoaded(ele, callback);}, 100);
	        }
		},
	    supplant : function(str, o) {
			return str.replace(/{([^{}]*)}/g, function(a, b) {
		        var p = b.split(/\./),
		            c = o;
		        for (var i = 0; i < p.length; i++) {
		          if (c[p[i]] == null)
		            return a;
		          c = c[p[i]];
		        }
				return typeof c === 'string' || typeof c === 'number' ? c : a;
			});
		}
	}

	$init
})();
</script>
EOT
}

mkdir -p $folderName/dev/

i=0
while [[ "${i}" -le "${chall}" ]]
do
	generate_template $i
	((i=i+1))
done
