// Function that distributes simetrically discrete points around a center
function s(x){
	if(x == 0) return 0;
	else return Math.pow(-1,x)*(Math.ceil(x/2));
}