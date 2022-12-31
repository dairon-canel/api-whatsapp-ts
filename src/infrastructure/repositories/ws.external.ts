import process from 'process';
import { Client, List, LocalAuth } from 'whatsapp-web.js';
import { image as imageQr } from 'qr-image';
import LeadExternal from '../../domain/lead-external.repository';

/**
 * Extendemos los super poderes de whatsapp-web
 */
class WsTransporter extends Client implements LeadExternal {
  private status = false;

  constructor() {
    super({
      authStrategy: new LocalAuth(),
      puppeteer: { headless: true },
    });

    console.log('Iniciando....');

    this.initialize();

    this.on('ready', () => {
      this.status = true;
      console.log('LOGIN_SUCCESS');
    });

    this.on('auth_failure', () => {
      this.status = false;
      console.log('LOGIN_FAIL');
    });

    this.on('message', async msg => {
      //console.log('MESSAGE RECEIVED', msg.body);
    });

    this.on('message_create', async msg => {
      // Fired on all message creations, including your own
      console.log('message created:', msg.body);
      if (msg.fromMe) {
        // do stuff here
        console.log('My own message');
      }

      if (msg.body === '!future') {
        // Send a new message as a reply to the current one
        msg.reply('Eres una loca y estas orgullosa de eso');
      } else if (msg.body === '!list') {
        let sections = [
          {
            title: 'Probar con un titulo diferente',
            rows: [
              { title: 'Titulo interesante namber uan' },
              { title: 'Titulo interesante namber tu' },
              { title: 'Titulo interesante namber tri' },
            ],
          },
          {
            title: 'Edicion de seccion',
            rows: [
              { title: 'Introduccion' },
              { title: 'Seccion fantastica 1' },
              { title: 'Seccion fantastica 2' },
              { title: 'Conclusiones' },
            ],
          },
        ];
        let list = new List(
          'Introduccion:\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc aliquet diam nec vestibulum consequat. Maecenas non lectus ultricies, rutrum nisi et, gravida nisl. Nullam viverra dolor id diam dictum, a dictum nisi posuere. Integer elementum dolor at nibh ullamcorper, eget aliquet massa tincidunt. Suspendisse potenti. Vivamus quis lobortis felis. Quisque non dui a elit efficitur congue. Nam fermentum diam non ipsum pellentesque, eu tincidunt magna ultricies. Morbi ut purus sollicitudin, efficitur massa non, ultricies eros. Nullam tincidunt, justo sed interdum rutrum, ligula metus viverra orci, a accumsan urna est at quam. Curabitur a lectus ultricies, accumsan lacus vitae, tincidunt nulla.\nSeccion fantastica 1:\n Suspendisse potenti. Vivamus at diam vehicula, auctor nisi et, pellentesque lectus. Proin viverra purus sed neque imperdiet, in ullamcorper arcu volutpat. Aliquam nec eleifend odio, at pretium tortor. Suspendisse at ullamcorper nulla, eu suscipit nisi. Nullam quis dignissim nulla. Nullam tristique risus ac leo placerat, auctor egestas metus malesuada. Aliquam porta nulla quis dui bibendum, a scelerisque dui blandit. Suspendisse vel erat ut velit sollicitudin lobortis. Quisque aliquet, tellus in euismod viverra, purus dui congue ligula, quis facilisis orci velit vel tellus. Nunc pharetra ex elit, non consequat erat rutrum eu. Vestibulum ac lectus dolor. Nunc hendrerit est et ex tristique porta. Duis euismod fermentum nibh, ac malesuada purus posuere sit amet. In hac habitasse platea dictumst. Praesent luctus, massa id vehicula tempus, justo ipsum consectetur lacus, at tempus urna libero sed erat. In hac habitasse platea dictumst. Nulla facilisi. Sed euismod erat eget nisl tincidunt, a suscipit orci fermentum. \nSeccion fantastica 2:\nProin vehicula massa ut urna ultricies cursus. Nam imperdiet, neque eget egestas vehicula, magna justo condimentum ligula, a aliquam purus arcu eget magna. Morbi id viverra sapien. Proin suscipit massa in mauris ultricies efficitur. Praesent malesuada, lacus id condimentum ullamcorper, dolor nisl pretium nunc, in posuere tellus urna eget diam. Aliquam erat volutpat. Sed ornare interdum est, non fermentum dui accumsan sed. Aliquam vel ipsum vel mauris consectetur pellentesque. Nullam non ligula vel neque vehicula dignissim. Vivamus ullamcorper volutpat elit, eget volutpat tellus. In hac habitasse platea dictumst. Maecenas nec felis vel magna ornare ornare vel ut nisl. Aliquam dictum nunc eget nisi suscipit, id vehicula magna ultricies.\nConclusiones:\n Aenean porttitor est sed dui varius, quis venenatis leo mollis. Fusce aliquam sapien quis odio ornare, in varius leo dictum. Nam tempus ultricies lacus id consectetur. Maecenas tristique laoreet diam. Suspendisse euismod lacus ac sollicitudin dictum. Duis congue non enim ac condimentum. Suspendisse potenti. Sed ut ultric',
          'Opciones de creacion para mr.Edgardo',
          sections,
          'Titulo fantastico del guion',
          'Otros titulos interesantes:\n-Titulo interesante namber uan\n-Titulo interesante namber tu\n-Titulo interesante namber tri',
        );
        this.sendMessage(msg.from, list);
      } else if (msg.body === '!reaction') {
        msg.react('👍');
      }
    });
  }

  /**
   * Enviar mensaje de WS
   * @param lead
   * @returns
   */
  async sendMsg(lead: { message: string; phone: string }): Promise<any> {
    try {
      if (!this.status) return Promise.resolve({ error: 'WAIT_LOGIN' });
      const { message, phone } = lead;
      const response = await this.sendMessage(`${phone}@c.us`, message);

      return { id: response.id.id, message: response.body };
    } catch (e: any) {
      return Promise.resolve({ error: e.message });
    }
  }

  getStatus(): boolean {
    return this.status;
  }

  private generateImage = (base64: string) => {
    const path = `${process.cwd()}/tmp`;
    let qr_svg = imageQr(base64, { type: 'svg', margin: 4 });
    qr_svg.pipe(require('fs').createWriteStream(`${path}/qr.svg`));
    console.log(`⚡ Recuerda que el QR se actualiza cada minuto ⚡'`);
    console.log(`⚡ Actualiza F5 el navegador para mantener el mejor QR⚡`);
  };
}

export default WsTransporter;
