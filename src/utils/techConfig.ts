// packages
import type { IconType } from 'react-icons';
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiReact,
  SiGo,
  SiRust,
  SiDocker,
  SiCss3,
  SiHtml5,
  SiNodedotjs,
  SiVuedotjs,
  SiAngular,
  SiPhp,
  SiRuby,
  SiSwift,
  SiKotlin,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiGraphql,
  SiKubernetes,
  SiTerraform,
  SiFlutter,
  SiDart,
  SiVite,
  SiTailwindcss,
  SiNestjs,
  SiNextdotjs,
  SiApachekafka,
  SiD3Dotjs,
  SiFlask,
  SiSelenium,
  SiFirebase,
  SiGithubactions,
  SiMysql,
  SiSqlite,
  SiAmazonwebservices,
  SiC,
  SiCplusplus,
  SiGnubash,
  SiSocketdotio,
  SiOpenjdk,
} from 'react-icons/si';

export interface TechInfo {
  color: string;
  Icon: IconType;
}

export const techConfig: Record<string, TechInfo> = {
  // Languages
  JavaScript:       { color: '#f7df1e', Icon: SiJavascript },
  TypeScript:       { color: '#3178c6', Icon: SiTypescript },
  Python:           { color: '#3776ab', Icon: SiPython },
  Go:               { color: '#00add8', Icon: SiGo },
  Rust:             { color: '#ce422b', Icon: SiRust },
  CSS:              { color: '#1572b6', Icon: SiCss3 },
  HTML:             { color: '#e34f26', Icon: SiHtml5 },
  PHP:              { color: '#777bb4', Icon: SiPhp },
  Ruby:             { color: '#cc342d', Icon: SiRuby },
  Swift:            { color: '#f05138', Icon: SiSwift },
  Kotlin:           { color: '#7f52ff', Icon: SiKotlin },
  Dart:             { color: '#0175c2', Icon: SiDart },
  C:                { color: '#a8b9cc', Icon: SiC },
  'C++':            { color: '#00599c', Icon: SiCplusplus },
  'C#':             { color: '#239120', Icon: SiAngular },
  Shell:            { color: '#4eaa25', Icon: SiGnubash },
  Java:             { color: '#f89820', Icon: SiOpenjdk },

  // Frameworks & Libraries
  React:            { color: '#61dafb', Icon: SiReact },
  'React Native':   { color: '#61dafb', Icon: SiReact },
  'Node.js':        { color: '#339933', Icon: SiNodedotjs },
  'Node/NestJS':    { color: '#339933', Icon: SiNodedotjs },
  'Vue.js':         { color: '#4fc08d', Icon: SiVuedotjs },
  Angular:          { color: '#dd0031', Icon: SiAngular },
  'Next.js':        { color: '#ffffff', Icon: SiNextdotjs },
  NestJS:           { color: '#e0234e', Icon: SiNestjs },
  Flask:            { color: '#ffffff', Icon: SiFlask },
  Flutter:          { color: '#02569b', Icon: SiFlutter },

  // Data & Databases
  MongoDB:          { color: '#47a248', Icon: SiMongodb },
  PostgreSQL:       { color: '#4169e1', Icon: SiPostgresql },
  MySQL:            { color: '#4479a1', Icon: SiMysql },
  SQLite:           { color: '#003b57', Icon: SiSqlite },
  Redis:            { color: '#dc382d', Icon: SiRedis },
  GraphQL:          { color: '#e10098', Icon: SiGraphql },

  // Tools & DevOps
  Docker:           { color: '#2496ed', Icon: SiDocker },
  Kubernetes:       { color: '#326ce5', Icon: SiKubernetes },
  Terraform:        { color: '#7b42bc', Icon: SiTerraform },
  'GitHub Actions': { color: '#2088ff', Icon: SiGithubactions },
  AWS:              { color: '#ff9900', Icon: SiAmazonwebservices },
  Firebase:         { color: '#ffca28', Icon: SiFirebase },
  Vite:             { color: '#646cff', Icon: SiVite },
  Tailwind:         { color: '#06b6d4', Icon: SiTailwindcss },

  // Misc
  'D3.js':          { color: '#f9a03c', Icon: SiD3Dotjs },
  'Apache Kafka':   { color: '#231f20', Icon: SiApachekafka },
  WebSocket:        { color: '#010101', Icon: SiSocketdotio },
  Selenium:         { color: '#43b02a', Icon: SiSelenium },
};
