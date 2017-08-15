import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from "rxjs/Rx";
import { environment } from '../../../environments/environment';

import { GraphView, Graph } from '../../models/models';

@Injectable()
export class DataService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: Http) {}

  authToken: string = "";

  getManagedDevices(event: any): Observable < Response > {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http
      .post(this.apiUrl + 'salt-events/getDevices', event, options)
      .catch(err => {
        console.log('Could not get devices');
        return Observable.throw(err);
      });
  }

  getManagedInterfaces(event: any): Observable < Response > {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http
      .post(this.apiUrl + 'salt-events/getInterfaces', event, options)
      .catch(err => {
        console.log('Could not get devices');
        return Observable.throw(err);
      });
  }

  postSaltEvent(event: any): Observable < any > {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http
      .post(this.apiUrl + 'salt-events/cli', event, options)
      .catch(err => {
        console.log('UI error handling');
        return Observable.throw(err);
      });
  }

  loginSaltEDI(auth: any): Observable < any > {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http
      .post(this.apiUrl + 'authentication/login', auth, options)
      .catch(err => {
        console.log("Error Logging in");
        return Observable.throw(err);
      });
  }

    getGraphData(queryParamaters: any):Observable<Graph> {
        let graph:Graph = {
                id:"92093u23",
                title:'Input Errors - xe-0/0/1 and xe-0/0/2',
                flotData: {
                    chartData: [],
                }
        };

        return Observable.of(graph);
    }

    getInfluxDbQueryResults(queryParameters:any):Observable<Response> {

        let query = `SELECT derivative(mean("value"), 1s) FROM "jnpr.jvision" WHERE "type" = '` + queryParameters.metric + `' AND "device" =~ /` + queryParameters.hostRegex + `$/ AND "interface" =~ /` + queryParameters.interface + `$/ AND time > ` + queryParameters.fromMinutes + `ms and time < ` + queryParameters.toMinutes + `ms GROUP BY "device", "interface", "type", time(1m)`;
        console.log(query);
        let queryJson = {"query":query};

        let chartData = [];
        return this.postInfluxDbQuery(queryJson)
            .map(response => response.json());

        //return Observable.of(graph);
    }

  getInfluxDbDevices(): Observable < Response > {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http
      .get(this.apiUrl + 'telemetry/devices', options)
      .catch(err => {
        console.log("Error");
        return Observable.throw(err);
      });
  }

  getInfluxDbInterfaces(): Observable < Response > {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http
      .get(this.apiUrl + 'telemetry/interfaces', options)
      .catch(err => {
        console.log("Error");
        return Observable.throw(err);
      });
  }

  getInfluxDbMetrics(): Observable < Response > {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http
      .get(this.apiUrl + 'telemetry/metrics', options)
      .catch(err => {
        console.log("Error");
        return Observable.throw(err);
      });
  }

  getDeviceList(): Observable < Response > {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-Auth-Token': sessionStorage.getItem("AUTH_TOKEN")
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http
      .get(this.apiUrl + 'devices', options)
      .catch(err => {
        console.log("Error Logging in");
        return Observable.throw(err);
      });
  }

  postInfluxDbQuery(query: any): Observable<Response> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    console.log(this.apiUrl + 'telemetry/query');
    return this.http
      .post(this.apiUrl + 'telemetry/query', query, options)
      .catch(err => {
        console.log('Failed to post query');
        return Observable.throw(err);
      });
  }



  getGraphDataByView(id: string): Observable < any > {
    let graphView: any = {
      viewId: "1",
      title: "Default View",
      graphs: [{
        title:'Traffic Statistics - xe-0/0/1 and xe-0/0/2',
        flotData: {
            chartData: [
                {
                "data": [[0,0],[0.5,0.479425538604203],[1,0.8414709848078965],[1.5,0.9974949866040544],[2,0.9092974268256817],[2.5,0.5984721441039564],[3,0.1411200080598672],[3.5,-0.35078322768961984],[4,-0.7568024953079282],[4.5,-0.977530117665097],[5,-0.9589242746631385],[5.5,-0.7055403255703919],[6,-0.27941549819892586],[6.5,0.21511998808781552],[7,0.6569865987187891],[7.5,0.9379999767747389],[8,0.9893582466233818],[8.5,0.7984871126234903],[9,0.4121184852417566],[9.5,-0.0751511204618093],[10,-0.5440211108893698],[10.5,-0.87969575997167],[11,-0.9999902065507035],[11.5,-0.8754521746884285],[12,-0.5365729180004349],[12.5,-0.06632189735120068],[13,0.4201670368266409],[13.5,0.803784426551621],[14,0.9906073556948704],[14.5,0.934895055524683],[15,0.6502878401571168],[15.5,0.2064674819377966]],
                "label": "sin(x)"
                },
                {
                "data": [[0,1],[0.5,0.8775825618903728],[1,0.5403023058681398],[1.5,0.0707372016677029],[2,-0.4161468365471424],[2.5,-0.8011436155469337],[3,-0.9899924966004454],[3.5,-0.9364566872907963],[4,-0.6536436208636119],[4.5,-0.2107957994307797],[5,0.28366218546322625],[5.5,0.70866977429126],[6,0.9601702866503661],[6.5,0.9765876257280235],[7,0.7539022543433046],[7.5,0.3466353178350258],[8,-0.14550003380861354],[8.5,-0.6020119026848236],[9,-0.9111302618846769],[9.5,-0.9971721561963784],[10,-0.8390715290764524],[10.5,-0.47553692799599256],[11,0.004425697988050785],[11.5,0.4833047587530059],[12,0.8438539587324921],[12.5,0.9977982791785807],[13,0.9074467814501962],[13.5,0.594920663309892],[14,0.1367372182078336],[14.5,-0.354924266788705],[15,-0.7596879128588213],[15.5,-0.9784534628188842]],
                "label": "cos(x)"
                }
            ],
        }
      },{
        title:'Packet Loss - xe-0/0/1 and xe-0/0/2',
        flotData: {
            chartData: [
                {
                "data": [[0,0],[0.5,0.479425538604203],[1,0.8414709848078965],[1.5,0.9974949866040544],[2,0.9092974268256817],[2.5,0.5984721441039564],[3,0.1411200080598672],[3.5,-0.35078322768961984],[4,-0.7568024953079282],[4.5,-0.977530117665097],[5,-0.9589242746631385],[5.5,-0.7055403255703919],[6,-0.27941549819892586],[6.5,0.21511998808781552],[7,0.6569865987187891],[7.5,0.9379999767747389],[8,0.9893582466233818],[8.5,0.7984871126234903],[9,0.4121184852417566],[9.5,-0.0751511204618093],[10,-0.5440211108893698],[10.5,-0.87969575997167],[11,-0.9999902065507035],[11.5,-0.8754521746884285],[12,-0.5365729180004349],[12.5,-0.06632189735120068],[13,0.4201670368266409],[13.5,0.803784426551621],[14,0.9906073556948704],[14.5,0.934895055524683],[15,0.6502878401571168],[15.5,0.2064674819377966]],
                "label": "sin(x)"
                },
                {
                "data": [[0,1],[0.5,0.8775825618903728],[1,0.5403023058681398],[1.5,0.0707372016677029],[2,-0.4161468365471424],[2.5,-0.8011436155469337],[3,-0.9899924966004454],[3.5,-0.9364566872907963],[4,-0.6536436208636119],[4.5,-0.2107957994307797],[5,0.28366218546322625],[5.5,0.70866977429126],[6,0.9601702866503661],[6.5,0.9765876257280235],[7,0.7539022543433046],[7.5,0.3466353178350258],[8,-0.14550003380861354],[8.5,-0.6020119026848236],[9,-0.9111302618846769],[9.5,-0.9971721561963784],[10,-0.8390715290764524],[10.5,-0.47553692799599256],[11,0.004425697988050785],[11.5,0.4833047587530059],[12,0.8438539587324921],[12.5,0.9977982791785807],[13,0.9074467814501962],[13.5,0.594920663309892],[14,0.1367372182078336],[14.5,-0.354924266788705],[15,-0.7596879128588213],[15.5,-0.9784534628188842]],
                "label": "cos(x)"
                }
            ],
        }
      },{
        title:'Data Usage - xe-0/0/1 and xe-0/0/2',
        flotData: {
            chartData: [
                {
                "data": [[0,0],[0.5,0.479425538604203],[1,0.8414709848078965],[1.5,0.9974949866040544],[2,0.9092974268256817],[2.5,0.5984721441039564],[3,0.1411200080598672],[3.5,-0.35078322768961984],[4,-0.7568024953079282],[4.5,-0.977530117665097],[5,-0.9589242746631385],[5.5,-0.7055403255703919],[6,-0.27941549819892586],[6.5,0.21511998808781552],[7,0.6569865987187891],[7.5,0.9379999767747389],[8,0.9893582466233818],[8.5,0.7984871126234903],[9,0.4121184852417566],[9.5,-0.0751511204618093],[10,-0.5440211108893698],[10.5,-0.87969575997167],[11,-0.9999902065507035],[11.5,-0.8754521746884285],[12,-0.5365729180004349],[12.5,-0.06632189735120068],[13,0.4201670368266409],[13.5,0.803784426551621],[14,0.9906073556948704],[14.5,0.934895055524683],[15,0.6502878401571168],[15.5,0.2064674819377966]],
                "label": "sin(x)"
                },
                {
                "data": [[0,1],[0.5,0.8775825618903728],[1,0.5403023058681398],[1.5,0.0707372016677029],[2,-0.4161468365471424],[2.5,-0.8011436155469337],[3,-0.9899924966004454],[3.5,-0.9364566872907963],[4,-0.6536436208636119],[4.5,-0.2107957994307797],[5,0.28366218546322625],[5.5,0.70866977429126],[6,0.9601702866503661],[6.5,0.9765876257280235],[7,0.7539022543433046],[7.5,0.3466353178350258],[8,-0.14550003380861354],[8.5,-0.6020119026848236],[9,-0.9111302618846769],[9.5,-0.9971721561963784],[10,-0.8390715290764524],[10.5,-0.47553692799599256],[11,0.004425697988050785],[11.5,0.4833047587530059],[12,0.8438539587324921],[12.5,0.9977982791785807],[13,0.9074467814501962],[13.5,0.594920663309892],[14,0.1367372182078336],[14.5,-0.354924266788705],[15,-0.7596879128588213],[15.5,-0.9784534628188842]],
                "label": "cos(x)"
                }
            ],
        }
      }]
    };

    return Observable.of(graphView);
  }

  getGraphViews(userId: string): Observable < any > {
    let views = [];

    views.push({
      "id": "1",
      "title": "Default View"
    });
    views.push({
      "id": "2",
      "title": "Alternative View"
    });

    return Observable.of(views);
  }

  getKeyValue(key:string): Observable < Response > {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http
      .get(this.apiUrl + 'key-value/' + key, options)
      .catch(err => {
        console.log("Error getting key data.");
        return Observable.throw(err);
      });
  }

  postKeyValue(keyValuePair: any): Observable < Response > {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http
      .post(this.apiUrl + 'key-value', keyValuePair, options)
      .catch(err => {
        console.log('Failed to post key value');
        return Observable.throw(err);
      });
  }

  deleteKeyValue(key:string): Observable < Response > {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers: headers
    });
    return this.http
      .delete(this.apiUrl + 'key-value/' + key, options)
      .catch(err => {
        console.log("Error deleting key");
        return Observable.throw(err);
      });
  }

}
