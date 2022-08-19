

if (currentSection == "Emails") {

  const appLazyApproval = Vue.createApp({

    template: `
	  <fieldset class="wp-85 wmx-450">
		<legend>Lazy Approval Mailbox</legend>		
		<div class='px-20 ContentTextNormal'>

			<div class="aligner">
				<label class='fw-110 pr-5' for="">Allow Lazy Approvals:</label>
				<input v-model="active" type="checkbox">
			</div>	

			<div class="aligner" >
				<label class='fw-110 ' >Mail Server:</label>
				<input v-model="mail_server" class='flex-1 wmx-200' type="text" 
					title="Ex: &#013 mail.issti.com:993/imap/ssl &#013 pop.example.com:995/pop3/ssl/novalidate-cert">
			</div>	

			<div class="aligner">
				<label class='fw-110 ' >Email Account:</label>
				<input v-model="email" class='wmx-150 EditBox' type="text">
			</div>	

			<div class="aligner">
				<label class='fw-110 pr-5' for="">Password:</label>
				<input v-model="password" class='wmx-150' type="password">
			</div>	
			<div class="aligner">
				<label class='fw-110 pr-5' for="">Poll time:</label>
				<input v-model="poll_secs" class='wmx-30 mr-5 EditBox' type="number">
				<label>secs</label>
			</div>	
			<div v-if="active" class='aligner'>
				<label class="fw-110 pr-5" for=""></label>
				<button @click="update(true)" class="button">Test</button>				
			</div>

			<div v-if="test_result" class='aligner'>
				<label class="fw-110 pr-5" for=""></label>
				<label :class="error_class">{{ test_result }}</label>
			</div>
			<br>
			
			<label class='fw-110 pr-5' for="">Recovery:</label>
			<div class="aligner">
				<label class='fw-110 pr-5' for="">Start Date:</label>
				<input v-model="date_start" class="ContentTextNormal" type="date">
			</div>	

			<div class="aligner">
				<label class='fw-110 pr-5 ' for="">End Date:</label>
				<input v-model="date_end" class="ContentTextNormal" type="date">
				<button @click="recover" class="button ml-5 wmx-70" type="button">Recover</button>
			</div>	

			<div v-if="recover_response" class="aligner">
				<label class='fw-110 pr-5 ' for=""></label>
				<textarea class="flex-1" rows=6>{{ recover_response }}</textarea>
			</div>	
			<br>

			<div class='aligner'>
				<label class="fw-110 pr-5" for=""></label>
				<button @click="update()" class="button">Update</button>				
			</div>

		</div>
		</fieldset>

  	`,

        data() {
            return {
                active: false,
                email: "",
                password: "",
                poll_secs: 0,
                date_start: "",
                date_end: "",
                mail_server: "",
                test_result: "",
                error_class: "",
                recover_response: "",
            }
        },

        methods: {

            async check_account() {

                const res = await fetch("../ajax_calls.php?func=checkMailBox")
                const ret = await res.json();

                if (ret.connected) {
                    this.error_class = ""
                    this.test_result = "Mailbox test successful."
                } else {
                    this.error_class = "ErrorMessage"
                    this.test_result = ret.error;
                }
                busy.hide();

            },

            recover() {

            	this.update();

            	busy.show2();

            	const p = {func: 'lazy_apr', f: 'INBOX.Processed'};
            	const url = payrollwebURI + '/cli/lazy_approvals.php';
            	xxhrPost( url, p, ( res ) => {

            		console.log( res);
            		const ret = JSON.parse(res);

            		let response = 'Recover details: \r\n \r\n'+
            			`Total Emals: ${ret.total} \r\n` +
            			`Retrieved: ${ret.retrieved} \r\n` +
            			`Validated: ${ret.validated} \r\n` +
            			`Re-applied approval: ${ret.applied}`;

            		if ( ret.notes ){
            			response += "\r\n\r\n";
            			ret.notes.forEach( (note)=>{
            				response = response + note + "\r\n";
            			})
            		}
            		this.recover_response = response;

            		busy.hide();
            	});

            },

            update(isTest = false) {

                busy.show2();

                let f = [],
                    v = [],
                    xp = [];
                let chk, s;

                const t = "APR_LAZY";

                // active rule
                chk = this.active ? "1" : "0";
                f.push('t|c|v1');
                v.push(`${t}, 1, ${chk}`.replaceAll(", ", "|"))
                xp.push(`t='${t}' and c = 1`)

                // email
                f.push('t|c|v3|d')
                v.push(`${t}, 2, ${this.email}, Email Account`.replaceAll(", ", "|"))
                xp.push(`t='${t}' and c = 2`)

                // password
                f.push('t|c|v3|d')
                v.push(`${t}, 3, ${this.password}, Email Account Password`.replaceAll(", ", "|"))
                xp.push(`t='${t}' and c = 3`)

                // poll time
                f.push('t|c|v1|d')
                v.push(`${t}, 4, ${this.poll_secs}, Poll time seconds`.replaceAll(", ", "|"))
                xp.push(`t='${t}' and c = 4`)

                // start date
                f.push('t|c|v3|d')
                v.push(`${t}, 5, ${this.date_start}, Recovery start date`.replaceAll(", ", "|"))
                xp.push(`t='${t}' and c = 5`)

                // enddate
                f.push('t|c|v3|d')
                v.push(`${t}, 6, ${this.date_end}, Recovery end date`.replaceAll(", ", "|"))
                xp.push(`t='${t}' and c = 6`)

                // mail server
                f.push('t|c|v3|d')
                v.push(`${t}, 7, ${this.mail_server}, Mail server`.replaceAll(", ", "|"))
                xp.push(`t='${t}' and c = 7`)

                let p = { func: 'UpdateSettings', f: f.join("|:|"), v: v.join("|:|"), xp: xp.join("|:|") }

                const saveSetting = () => {
                    xxhrPost("../ajax_calls.php", p, res => {

                        if (isTest) {
                            this.check_account();
                        } else {
                            busy.hide();
                        }
                    })
                }

                saveSetting();
            },

        },
        beforeMount() {

            busy.show2();

            let p = { func: 'GetMultiRecs', t: 1, f: "fc|fv1|fv3", xp: "f1 = 'APR_LAZY'", rc: 1 }
            xxhrPost('../ajax_calls.php', p, res => {

                const ret = JSON.parse(res);
                Object.values(ret).forEach(item => {

                    if (item.fc == 1) {
                        this.active = parseInt(item.fv1) ? true : false;
                    } else if (item.fc == 2) {
                        this.email = item.fv3
                    } else if (item.fc == 3) {
                        this.password = item.fv3
                    } else if (item.fc == 4) {
                        this.poll_secs = item.fv1
                    } else if (item.fc == 5) {
                        this.date_start = item.fv3
                    } else if (item.fc == 6) {
                        this.date_end = item.fv3
                    } else if (item.fc == 7) {
                        this.mail_server = item.fv3
                    }
                });

                busy.hide();
            })

        },
    });

    const proxyLazyApproval = appLazyApproval.mount("#lazyMailbox");

}