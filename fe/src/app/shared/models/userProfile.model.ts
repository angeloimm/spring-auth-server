export class UserProfile{
    username:string;
    nome:string;
    cognome:string;
    email:string;
    codiceFiscale:string;
    claims:object;
    toString(): string {
        return  this.username + ' ' + this.nome  + ' ' + 
                this.cognome  + ' ' + this.email + ' ' + 
                this.codiceFiscale + ' ' + this.claims;
    }
}