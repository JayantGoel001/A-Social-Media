export function AutoUnsubscribe(constructor:any) {

	const original = constructor.prototype.ngOnDestroy;

	constructor.prototype.ngOnDestroy = function () {
		for (let prop in this) {
			if(prop == "subscriptions") {
				for(let sub of this[prop]) {
					if (sub && (typeof sub.unsubscribe === "function")) {
						sub.unsubscribe();
					}
				}
				break;
			}
		}
		original && typeof original === "function" && original.apply(this, arguments);
	};
}
