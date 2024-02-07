import React, { useEffect,useState } from 'react'
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Grid, Paper } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import TitleBar from "./TitleBar"
import SelfTitleBar from "./SelfTitleBar"
import { useLoaderData } from 'react-router-dom';

export default function Main() {

  //Done setting email as current user's name in UI,rendering friends list is left
  const {email,friends} = useLoaderData()

  //Populate this using the content from database
var [chatAreaContent,setChatAreaContent] = useState("<b>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates officia, omnis delectus minima exercitationem dolorem et adipisci corporis quos mollitia porro quo eaque tenetur quas officiis, incidunt enim praesentium cum modi. Similique id, qui officia dolore quo tenetur obcaecati fuga adipisci repudiandae nobis eius doloremque a voluptatem cumque at veritatis totam esse natus facilis quaerat aspernatur suscipit fugiat non molestias. Aliquam harum ut saepe quidem, esse vero perspiciatis dolores, cum dignissimos deleniti dolor quibusdam reiciendis, velit deserunt amet fugiat voluptates totam ex magnam et officiis beatae! Voluptate odio, sapiente ut asperiores quae mollitia alias animi tempora praesentium adipisci similique quis nobis quasi quia suscipit rem ratione voluptatum illum, magni id sequi debitis, neque architecto? Recusandae unde laborum, commodi quam a est enim, maxime ducimus itaque explicabo adipisci laboriosam libero voluptatibus maiores minima veritatis delectus blanditiis. Tempora ratione exercitationem quibusdam natus sed rem, laborum nihil dolor, assumenda tenetur mollitia maxime ipsam repellendus voluptatibus quasi, sequi maiores id ad officiis iusto quis voluptatum autem sit voluptatem? Exercitationem possimus aliquam perferendis accusamus omnis totam iusto autem earum voluptatum minus est nihil, tempora, perspiciatis dolore nulla? Vitae, unde! Doloribus soluta labore rerum eveniet impedit nihil officiis odit cumque! Dolore, eveniet, accusamus debitis optio impedit fuga aliquid molestiae ipsam nulla voluptas sunt hic. Deserunt omnis consectetur, quod ad blanditiis est adipisci, voluptatem dolores accusamus ipsam, officia alias veritatis? Dolores non animi pariatur? Quod, maxime delectus nesciunt voluptate aliquam odio dicta sit ut iure libero et alias autem modi minus. Accusamus molestias repellendus obcaecati autem laborum dolorem eius. Fuga illum labore dolore, sapiente quia officia perferendis dignissimos facilis adipisci. Labore exercitationem quibusdam qui beatae excepturi voluptates. Optio earum officia laborum voluptatem id expedita, sapiente officiis. Inventore nesciunt dolorem nisi! Eos libero ea adipisci velit voluptate sunt, deleniti quisquam. Asperiores fugiat quisquam corrupti repellendus excepturi iste. Ut iure cumque natus omnis facilis fugit, ad fuga magni quam? Iste non sunt quod reiciendis itaque, totam quia doloribus consequuntur mollitia et, aut fuga, accusantium inventore dolores. Numquam, rerum eligendi distinctio odit obcaecati deleniti earum. Cum dolorem rerum ducimus sit tempore illo autem ad eum? Ipsa voluptatem ducimus sequi ab totam quisquam, et, nobis tempora animi laborum eaque, deleniti dolorum? Culpa vitae, praesentium mollitia asperiores natus pariatur numquam beatae quod quae vero cumque ut ullam modi accusantium dolorum ea illum ipsam magni consequatur quasi, eum rem aperiam suscipit officiis? Dolorum reiciendis repellendus ad quam ipsa corporis vel! Expedita optio earum hic iure unde veniam deleniti, atque quam culpa molestiae quasi necessitatibus vero quaerat officiis commodi ullam omnis eligendi, ipsa dicta dolorum quis rem. Sapiente voluptas ratione eveniet non repudiandae, itaque excepturi impedit cum? Maxime consequuntur aspernatur accusantium libero, fuga architecto eligendi ea harum qui quaerat. Necessitatibus dolore dignissimos est quisquam quasi placeat cupiditate. Quidem nemo repudiandae cupiditate voluptatibus sed atque dolore ullam, distinctio libero animi velit facilis? Porro temporibus saepe cupiditate aperiam quos tempora neque ipsa repudiandae odit earum veritatis eos excepturi culpa a iusto minus dignissimos consectetur inventore quae quisquam, non repellat placeat? Culpa eos dolore corrupti ut architecto.Hiii lorem100</b> Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum illo repellat quis, praesentium alias enim aliquid corrupti accusamus perspiciatis repellendus est incidunt voluptatem, quo ex et quisquam facere quae, similique eius veniam libero temporibus obcaecati laborum. Voluptatem, ipsum ratione. Eum nisi, doloribus a blanditiis, ratione animi maxime nihil accusamus, at quod quos aperiam accusantium unde iure saepe laboriosam impedit eveniet! Similique autem, voluptatem excepturi unde tempore aliquid, dolorem fugiat enim sed non voluptates, corporis esse ipsam pariatur deleniti maiores error? Architecto quas vitae incidunt pariatur doloribus dolore voluptates fuga unde consectetur nobis quae itaque amet fugit, ducimus cumque voluptatum optio? Architecto fugiat, dolorum voluptates vitae a alias asperiores nulla id placeat maxime quia obcaecati accusantium dolor quos nisi sapiente repudiandae debitis recusandae quo itaque doloribus. Fugiat dolorem officia rem error velit ea, praesentium, asperiores doloremque nemo voluptatum accusantium veritatis quidem temporibus rerum eligendi dicta esse totam eius natus expedita consequuntur adipisci, aut minus. Reiciendis similique dicta eveniet. Libero eos delectus dolorum suscipit fugiat quod perferendis aliquam optio illum, itaque eum ducimus, numquam totam atque minus autem reiciendis odio id tenetur voluptatibus recusandae! Sed, dolore aspernatur? Dolor ducimus alias possimus neque blanditiis qui. Quaerat reiciendis repellendus labore fugit esse harum iure nemo aperiam hic consequuntur doloribus dicta aliquam vel eius facilis cum laboriosam voluptatem, deserunt ipsa et ipsum adipisci saepe? Dolorem aliquam iusto, eveniet quia possimus repellendus earum sequi, voluptatum, aperiam quidem consequuntur? Eius perferendis labore nemo! Perspiciatis molestias expedita, doloribus vitae, vero iste pariatur odit numquam, impedit laudantium voluptatibus consequuntur quisquam unde perferendis tempora explicabo voluptatum nostrum ipsum veniam saepe. Id placeat vero earum eveniet eligendi fugit commodi, quod sequi velit cum iure dolorem quaerat reiciendis ad amet inventore. Similique praesentium itaque iste magni et ipsam explicabo animi, nam harum quia at facere earum sapiente placeat laboriosam, quis aliquam nihil quos! Id molestias soluta aperiam possimus ab distinctio quisquam est mollitia itaque eaque maiores porro suscipit recusandae odit, ducimus, sequi in esse, error voluptates laboriosam blanditiis cum! Aspernatur voluptatum ipsa, hic accusantium assumenda voluptatem eaque laborum, commodi perspiciatis ut a odit temporibus repellendus beatae sit, neque cumque dolorum ullam dignissimos quam. Deleniti facilis ratione aliquam commodi! Optio, magni rerum aliquid porro nisi assumenda mollitia ipsa culpa illum excepturi? Voluptatem voluptates deleniti laudantium, ea voluptatibus quibusdam debitis dolorem adipisci inventore quia possimus. Quaerat architecto saepe distinctio quos praesentium ipsum delectus ex. Quas libero veniam beatae laboriosam eveniet molestias, numquam culpa itaque expedita soluta deserunt corrupti ex, sapiente molestiae natus quos voluptatum quaerat corporis recusandae fugit ipsum! Cum vel ea et corporis consectetur quasi, iusto sequi sint perferendis facere saepe tenetur amet voluptates fugit accusantium quia ipsa ex dolore eveniet architecto. Provident expedita voluptates dignissimos accusantium obcaecati nostrum corrupti iure modi sint qui, incidunt eius animi! Amet corrupti numquam ea fugit. Fugiat, facere molestias. Ratione quae tempore exercitationem voluptas alias animi tenetur temporibus provident quos reprehenderit maxime eos excepturi, nobis harum, sit unde adipisci? Quod deleniti nemo nostrum sunt illum natus. Eum provident quis praesentium illum deserunt nostrum alias dignissimos doloremque laudantium.")

  var [indexx,setIndexx] = useState("Emptyyyyy")

  function addDataToChatArea(chatAreaContent){
    const newDiv = document.createElement("div")
    newDiv.innerHTML = chatAreaContent
    const chatArea = document.getElementById("chatArea")
    chatArea.innerHTML = ""
    chatArea.appendChild(newDiv)
  }

  useEffect(()=>{
    addDataToChatArea(chatAreaContent)
  },[chatAreaContent])


  function renderRow(props) {
    const { index, style } = props;
    const displayChatArea = (index)=>{
      console.log("displayChatArea onClick works "+ (index+1))
      setIndexx(index+1)
      setChatAreaContent(`${index+1}`)
    }
  
    return (
      <ListItem style={style} key={index} component="div" disablePadding>
        <ListItemButton sx={{background:"white", border:"0.5px solid #808080"}} onClick={()=>displayChatArea(index)}>
          <ListItemText primary={`Item ${index + 1}`} />
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <>
    <Container maxWidth="false" disableGutters>
      <Box sx={{ bgcolor: '#cfe8fc', height: '100vh' }}>
        <Grid container spacing={0}>
          <Grid item xs={4}>
            <Paper elevation={0}>
              <SelfTitleBar email={email}/>
          <FixedSizeList
            height={575}
            width={455}
            itemSize={46}
            itemCount={10}
            overscanCount={5}
          >
            {renderRow}
          </FixedSizeList>
          </Paper>
          </Grid>
          <Grid item xs={8}>
            <Container disableGutters>
              <Box sx={{height:"100vh", overflowY:"scroll"}} >
                <TitleBar name={indexx}/>
                <div id='chatArea'>

                </div>
              </Box>
            </Container>
          </Grid>
        </Grid>
      </Box>
    </Container>
    </>
  )
}
