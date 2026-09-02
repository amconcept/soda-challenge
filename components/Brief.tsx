import Bubbles from "./Bubbles";
import SiteActions from "./SiteActions";
import "./brief.css";

export default function Brief() {
  return (
    <article className="brief">
      <section id="intro" className="brief-section">
        <p className="brief-kicker">What is SOD+A?</p>
        <h2>Schools of Discovery + Action</h2>
        <p>
          SOD+A stands for Schools of Discovery + Action. It is an international
          design challenge where students explore ideas through creative uses of
          technology, share knowledge and collaborate with students in other
          communities, then bring their different skills and discoveries together
          to co-design a project that makes a lasting contribution locally.
        </p>
        <p className="brief-quote">You may be local, but knowledge is global.</p>
      </section>

      <Bubbles variant="b" slot={0} />

      <section className="brief-section">
        <p className="brief-kicker">What is the challenge?</p>
        <h2>See how far you can take an idea</h2>
        <p>
          The challenge is to see how far you can take an idea: experiment, learn
          new skills, get feedback, make changes, share what you discover, put it
          into action, and meet criteria set by partner institutions. Along the
          way, you build a portfolio and develop the creative, technical, and
          human skills universities and innovative organizations are looking for.
        </p>
      </section>

      <Bubbles variant="c" slot={1} />

      <section className="brief-section">
        <p className="brief-kicker">Who is it for?</p>
        <h2>Students who want to make things with others</h2>
        <p>
          SOD+A is for students in schools, makerspaces, or Fab Labs interested in
          engineering, entrepreneurship, digital and product design, creative
          direction, project management, art and technology, or any field where
          ideas, initiative, collaboration, and community engagement matter.
        </p>
      </section>

      <Bubbles variant="a" slot={2} />

      <section className="brief-section">
        <p className="brief-kicker">Why?</p>
        <h2>The hidden side of innovation</h2>
        <p>
          School gives you knowledge, skills, and structure. The SOD+A Challenge
          asks you to experience the hidden side of innovation: creativity,
          resilience, judgement, collaboration, and the ability to dive deeply
          into interests, technologies, and ideas that can have a positive impact.
        </p>
        <p>
          You build a portfolio that makes your process, decisions, and growth
          visible, while receiving feedback and recognition from partner schools
          and organizations that value these skills. It is a chance to get noticed
          while having fun, discovering what you can do, and learning what it
          means to bring your talents into the world.
        </p>
      </section>

      <Bubbles variant="b" slot={3} />

      <section className="brief-section">
        <p className="brief-kicker">How does it work?</p>
        <h2>Join a local group. Share a global process.</h2>
        <p>
          You join a local group and identify a project you can co-design in your
          community. Then you head into a studio, lab, classroom, makerspace, or
          other creative space to experiment with ideas, materials, and
          technologies.
        </p>
        <p>
          Curated random prompts and creative constraints push you toward
          unexpected combinations, new skills, and ideas you may not have explored
          on your own.
        </p>
        <p>
          Along the way, you document and share what you learn, see what students
          in other communities are discovering, receive feedback, make changes,
          and bring your discoveries back into the collective project.
        </p>
        <p>
          The challenge is to keep developing your ideas, share what you know,
          respond to feedback, put your learning into action, and meet the
          criteria set by partner institutions.
        </p>
      </section>

      <Bubbles variant="c" slot={4} />

      <SiteActions placement="footer" />
    </article>
  );
}
