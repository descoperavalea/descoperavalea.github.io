import { Layout } from '@/components/Layout';
import heroLandscape from '@/assets/hero-landscape.jpg';
import mountainRoad from '@/assets/gallery-mountain-road.jpg';

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-24 md:pt-32">
        <div className="container-editorial">
          <div className="max-w-3xl">
            <span className="caption block mb-4">Despre noi</span>
            <h1 className="text-balance mb-6">
              O poveste despre natură și explorare
            </h1>
            <p className="text-xl text-muted-foreground">
              Descoperă Valea este un proiect vizual editorial dedicat frumuseții sălbatice a Văii Jiului și a munților înconjurători.
            </p>
          </div>
        </div>
      </section>

      {/* Main Image */}
      <section className="pt-8 pb-12 md:pt-12 md:pb-16">
        <div className="container-editorial">
          <div className="aspect-[21/9] overflow-hidden rounded-xl">
            <img
              src={heroLandscape}
              alt="Valea Jiului panorama"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-space pt-8 md:pt-12">
        <div className="container-editorial">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 className="mb-6">Misiunea noastră</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Am pornit acest proiect din dorința de a documenta și împărtăși peisajele spectaculoase ale Văii Jiului – o zonă mai puțin cunoscută, dar de o frumusețe remarcabilă.
                </p>
                <p>
                  Prin imagini, video și povești, încercăm să aducem în atenție traseele montane, drumurile forestiere și colțurile ascunse ale acestei regiuni.
                </p>
                <p>
                  Nu suntem o agenție de turism. Suntem exploratori pasionați de natură care doresc să inspire și pe alții să descopere aceste locuri.
                </p>
              </div>
            </div>

            <div>
              <h2 className="mb-6">Ce facem</h2>
              <div className="space-y-6">
                <div className="border-l-2 border-primary pl-4">
                  <h3 className="font-serif text-xl mb-2">Fotografie</h3>
                  <p className="text-sm text-muted-foreground">
                    Documentăm peisajele montane în toate anotimpurile, de la dimineți cu ceață până la apusuri spectaculoase.
                  </p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <h3 className="font-serif text-xl mb-2">Video</h3>
                  <p className="text-sm text-muted-foreground">
                    Creăm clipuri care surprind atmosfera și energia locurilor pe care le explorăm.
                  </p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <h3 className="font-serif text-xl mb-2">Experiențe 4x4</h3>
                  <p className="text-sm text-muted-foreground">
                    Organizăm aventuri off-road pe drumuri forestiere, unele contra cost, pentru cei dornici să exploreze alături de noi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="section-space bg-secondary/30">
        <div className="container-editorial">
          <blockquote className="max-w-3xl mx-auto text-center">
            <p className="font-serif text-2xl md:text-4xl mb-6 text-balance">
              „Natura nu este un loc de vizitat. Este acasă."
            </p>
            <cite className="caption not-italic">Gary Snyder</cite>
          </blockquote>
        </div>
      </section>

      {/* Image Grid */}
      <section className="section-space">
        <div className="container-editorial">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="aspect-[4/3] overflow-hidden rounded-xl">
              <img
                src={mountainRoad}
                alt="Drum de munte"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-xl">
              <img
                src={heroLandscape}
                alt="Peisaj montan"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
